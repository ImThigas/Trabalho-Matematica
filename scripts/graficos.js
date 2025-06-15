document.addEventListener("DOMContentLoaded", () => {
  const seletorTipoInputs = document.querySelectorAll(
    'input[name="tipoEquacao"]'
  );
  const termA = document.getElementById("term-a");
  const plusA = document.getElementById("plus-a");
  const tituloAnalise = document.getElementById("tituloAnalise");
  const coefAInput = document.getElementById("coefA");
  const coefBInput = document.getElementById("coefB");
  const coefCInput = document.getElementById("coefC");
  const btnGerarGrafico = document.getElementById("btnGerarGrafico");
  const canvas = document.getElementById("graficoEquacao");
  const ctx = canvas.getContext("2d");
  const infoRaizes = document.getElementById("infoRaizes");
  const corpoTabelaAnalise = document.getElementById("corpoTabelaAnalise");
  const equationExample = document.getElementById("equationExample");
  const solutionStepsContainer = document.getElementById("solution-steps");
  let meuGrafico;
  let currentChartData = {};

  function getChartOptions() {
    const isDark = document.body.dataset.theme === "dark";
    const gridColor = isDark
      ? "rgba(224, 224, 224, 0.1)"
      : "rgba(0, 0, 0, 0.1)";
    const textColor = isDark ? "rgba(224, 224, 224, 0.8)" : "#555";
    return {
      responsive: true,
      scales: {
        y: {
          title: { display: true, text: "Eixo Y", color: textColor },
          ticks: { color: textColor },
          grid: { color: gridColor },
        },
        x: {
          type: "linear",
          position: "bottom",
          title: { display: true, text: "Eixo X", color: textColor },
          ticks: { color: textColor },
          grid: { color: gridColor },
        },
      },
      plugins: {
        legend: { labels: { color: textColor, boxWidth: 15, padding: 20 } },
        tooltip: { boxPadding: 5 },
      },
    };
  }

  function atualizarInterface() {
    const tipoSelecionado = document.querySelector(
      'input[name="tipoEquacao"]:checked'
    ).value;
    if (tipoSelecionado === "2") {
      termA.classList.remove("hidden");
      plusA.classList.remove("hidden");
      tituloAnalise.textContent = "Análise da Parábola";
      equationExample.innerHTML =
        "Exemplo: para <strong>y = x² - 2x - 3</strong>, use a=1, b=-2 e c=-3.";
    } else {
      termA.classList.add("hidden");
      plusA.classList.add("hidden");
      tituloAnalise.textContent = "Análise da Reta";
      equationExample.innerHTML =
        "Exemplo: para <strong>y = 2x + 1</strong>, use b=2 e c=1.";
    }
    executarAnalise();
  }

  function executarAnalise() {
    const tipoSelecionado = document.querySelector(
      'input[name="tipoEquacao"]:checked'
    ).value;
    const a = tipoSelecionado === "2" ? parseFloat(coefAInput.value) || 0 : 0;
    const b = parseFloat(coefBInput.value) || 0;
    const c = parseFloat(coefCInput.value) || 0;

    corpoTabelaAnalise.innerHTML = "";
    solutionStepsContainer.innerHTML = "";
    currentChartData = {
      a,
      b,
      c,
      rootPoints: [],
      vertexPoint: null,
      interceptPoint: null,
    };

    if (tipoSelecionado === "2") {
      analisarSegundoGrau(a, b, c);
      displaySecondDegreeSolution(a, b, c);
    } else {
      analisarPrimeiroGrau(b, c);
      displayFirstDegreeSolution(b, c);
    }
    gerarGrafico();
  }

  function analisarSegundoGrau(a, b, c) {
    if (a === 0) {
      analisarPrimeiroGrau(b, c);
      return;
    }
    const pontosNotaveis = new Map();
    const delta = b * b - 4 * a * c;
    const addPoint = (x, desc, isRootFlag = false) => {
      const key = Number(x.toFixed(3));
      if (pontosNotaveis.has(key)) {
        const existing = pontosNotaveis.get(key);
        if (!existing.descricao.includes(desc)) {
          existing.descricao += ` e ${desc}`;
        }
        existing.isRoot = existing.isRoot || isRootFlag;
      } else {
        pontosNotaveis.set(key, { descricao: desc, isRoot: isRootFlag });
      }
    };
    const xV = -b / (2 * a);
    const yV = a * xV * xV + b * xV + c;
    currentChartData.vertexPoint = { x: xV, y: yV };
    currentChartData.interceptPoint = { x: 0, y: c };
    addPoint(0, "Intercepto Y");
    addPoint(xV, "Vértice");
    if (delta < 0) {
      infoRaizes.textContent = "A equação não possui raízes reais.";
    } else {
      const x1 = (-b + Math.sqrt(delta)) / (2 * a);
      addPoint(x1, "Raiz", true);
      currentChartData.rootPoints.push({ x: x1, y: 0 });
      if (delta > 0) {
        const x2 = (-b - Math.sqrt(delta)) / (2 * a);
        addPoint(x2, "Raiz", true);
        currentChartData.rootPoints.push({ x: x2, y: 0 });
        infoRaizes.textContent =
          "A equação possui duas raízes reais distintas.";
      } else {
        infoRaizes.textContent = "A equação possui uma única raiz real.";
      }
    }
    const pontosOrdenados = [...pontosNotaveis.entries()].sort(
      (a, b) => a[0] - b[0]
    );
    pontosOrdenados.forEach(([x, info]) => {
      const y = a * x * x + b * x + c;
      const calculoStr = `y = (${a})(${x.toFixed(2)})² + (${b})(${x.toFixed(
        2
      )}) + (${c})`;
      adicionarLinhaTabela(x, calculoStr, y, info.descricao, info.isRoot);
    });
  }

  function analisarPrimeiroGrau(b, c) {
    const pontosNotaveis = new Map();
    currentChartData.interceptPoint = { x: 0, y: c };
    pontosNotaveis.set(0, { descricao: "Intercepto Y" });
    if (b !== 0) {
      const raiz = -c / b;
      infoRaizes.textContent = "A equação possui uma única raiz.";
      currentChartData.rootPoints.push({ x: raiz, y: 0 });
      pontosNotaveis.set(Number(raiz.toFixed(3)), {
        descricao: "Raiz",
        isRoot: true,
      });
    } else {
      infoRaizes.textContent = c === 0 ? "Infinitas raízes." : "Sem raiz.";
    }
    const pontosOrdenados = [...pontosNotaveis.entries()].sort(
      (a, b) => a[0] - b[0]
    );
    pontosOrdenados.forEach(([x, info]) => {
      const y = b * x + c;
      const calculoStr = `y = (${b})(${x.toFixed(2)}) + (${c})`;
      adicionarLinhaTabela(x, calculoStr, y, info.descricao, info.isRoot);
    });
  }

  function adicionarLinhaTabela(x, calculo, y, descricao, isRoot) {
    const linha = document.createElement("tr");
    const cellClass = isRoot ? 'class="root-cell"' : "";
    const rowClass = isRoot ? 'class="root-row-bg"' : "";

    linha.className = rowClass;
    linha.innerHTML = `
            <td ${cellClass}>${x.toFixed(2)}</td>
            <td>${calculo}</td>
            <td ${cellClass}>${y.toFixed(2)}</td>
            <td ${cellClass}>${descricao}</td>
        `;
    corpoTabelaAnalise.appendChild(linha);
  }

  function displaySecondDegreeSolution(a, b, c) {
    if (a === 0) {
      displayFirstDegreeSolution(b, c);
      return;
    }
    let html = "";
    const delta = b * b - 4 * a * c;
    html += `<p><strong>1. Calculando o discriminante (Delta):</strong></p>`;
    html += `<p>Fórmula: $$\\Delta = b^2 - 4ac$$</p>`;
    html += `<p>Substituindo: $$\\Delta = (${b})^2 - 4 \\cdot (${a}) \\cdot (${c})$$</p>`;
    html += `<p>Resultado: $$\\Delta = ${delta.toFixed(2)}$$</p>`;
    if (delta < 0) {
      html += `<p>Como o valor de Delta é negativo, a equação não possui raízes reais.</p>`;
    } else {
      html += `<p><strong>2. Aplicando a fórmula de Bhaskara:</strong></p>`;
      html += `<p>Fórmula: $$x = \\frac{-b \\pm \\sqrt{\\Delta}}{2a}$$</p>`;
      html += `<p>Substituindo: $$x = \\frac{-(${b}) \\pm \\sqrt{${delta.toFixed(
        2
      )}}}{2 \\cdot (${a})}$$</p>`;
      if (delta === 0) {
        const x = -b / (2 * a);
        html += `<p>Como Delta é zero, há apenas uma raiz:</p>`;
        html += `<p>$$x = \\frac{${-b}}{${2 * a}} = ${x.toFixed(2)}$$</p>`;
      } else {
        const x1 = (-b + Math.sqrt(delta)) / (2 * a);
        const x2 = (-b - Math.sqrt(delta)) / (2 * a);
        html += `<p>Calculando as duas raízes:</p>`;
        html += `<p>$$x_1 = \\frac{${-b} + ${Math.sqrt(delta).toFixed(2)}}{${
          2 * a
        }} = ${x1.toFixed(2)}$$</p>`;
        html += `<p>$$x_2 = \\frac{${-b} - ${Math.sqrt(delta).toFixed(2)}}{${
          2 * a
        }} = ${x2.toFixed(2)}$$</p>`;
      }
    }
    solutionStepsContainer.innerHTML = html;
    if (window.MathJax) {
      MathJax.typesetPromise();
    }
  }

  function displayFirstDegreeSolution(b, c) {
    let html = "";
    if (b !== 0) {
      const x = -c / b;
      html += `<p><strong>1. Isolando a incógnita x:</strong></p>`;
      html += `<p>Equação: $$(${b})x + (${c}) = 0$$</p>`;
      html += `<p>Subtraindo ${c} dos dois lados: $$(${b})x = ${-c}$$</p>`;
      html += `<p>Dividindo por ${b}: $$x = \\frac{${-c}}{${b}}$$<p>`;
      html += `<p><strong>Resultado: $$x = ${x.toFixed(2)}$$</strong></p>`;
    } else {
      html +=
        c === 0
          ? `<p>A equação é 0 = 0, o que é sempre verdade (infinitas soluções).</p>`
          : `<p>A equação é ${c} = 0, o que é falso (nenhuma solução).</p>`;
    }
    solutionStepsContainer.innerHTML = html;
    if (window.MathJax) {
      MathJax.typesetPromise();
    }
  }

  function gerarGrafico() {
    const { a, b, c, rootPoints, vertexPoint, interceptPoint } =
      currentChartData;
    const dataPoints = [];
    const xMin = -10,
      xMax = 10,
      step = 0.25;
    for (let x = xMin; x <= xMax; x += step) {
      dataPoints.push({ x: x, y: a * x * x + b * x + c });
    }
    if (meuGrafico) {
      meuGrafico.destroy();
    }

    const isDark = document.body.dataset.theme === "dark";
    const brandColor = isDark ? "#bb86fc" : "#3949ab";
    const brandColorTransparent = isDark ? "#bb86fc40" : "#3949ab40";
    const rootColor = isDark ? "#ff8a80" : "#e53935";
    const vertexColor = isDark ? "#64dd17" : "#4caf50";
    const interceptColor = isDark ? "#81d4fa" : "#039be5";
    const axisColor = isDark
      ? "rgba(255, 255, 255, 0.45)"
      : "rgba(0, 0, 0, 0.35)";

    const yValues = dataPoints.map((p) => p.y);
    const yChartMin = Math.min(...yValues);
    const yChartMax = Math.max(...yValues);
    const yPadding = (yChartMax - yChartMin) * 0.1 || 5;

    const datasets = [
      {
        label: "Eixo X",
        data: [
          { x: xMin, y: 0 },
          { x: xMax, y: 0 },
        ],
        borderColor: axisColor,
        borderWidth: 1.5,
        pointRadius: 0,
        order: 0,
      },
      {
        label: "Eixo Y",
        data: [
          { x: 0, y: yChartMin - yPadding },
          { x: 0, y: yChartMax + yPadding },
        ],
        borderColor: axisColor,
        borderWidth: 1.5,
        pointRadius: 0,
        order: 0,
      },
      {
        label: `Função`,
        data: dataPoints,
        borderColor: brandColor,
        backgroundColor: brandColorTransparent,
        borderWidth: 2.5,
        tension: a === 0 ? 0 : 0.1,
        pointRadius: 0,
        fill: "origin",
        order: 1,
      },
      {
        label: "Raízes",
        data: rootPoints,
        type: "scatter",
        backgroundColor: rootColor,
        pointRadius: 6,
        pointHoverRadius: 8,
        order: 3,
      },
    ];

    if (vertexPoint) {
      datasets.push({
        label: "Vértice",
        data: [vertexPoint],
        type: "scatter",
        backgroundColor: vertexColor,
        pointRadius: 7,
        pointHoverRadius: 9,
        order: 2,
      });
    }
    if (interceptPoint) {
      datasets.push({
        label: "Intercepto Y",
        data: [interceptPoint],
        type: "scatter",
        backgroundColor: interceptColor,
        pointRadius: 7,
        pointHoverRadius: 9,
        order: 2,
      });
    }

    meuGrafico = new Chart(ctx, {
      type: "line",
      data: { datasets: datasets },
      options: getChartOptions(),
    });
  }

  btnGerarGrafico.addEventListener("click", executarAnalise);
  seletorTipoInputs.forEach((input) =>
    input.addEventListener("change", atualizarInterface)
  );
  window.addEventListener("themeChanged", () => {
    if (meuGrafico) {
      gerarGrafico();
    }
  });

  atualizarInterface();
});
