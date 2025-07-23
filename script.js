/**
 * Função principal que verifica se existe um subconjunto de pedras que soma zero
 * e retorna o subconjunto encontrado (se existir)
 * @param {number[]} stones - Array de pedras mágicas
 * @returns {number[]|null} - Subconjunto que soma zero ou null se não existir
 */
function findBalancedSubset(stones) {
  // Usaremos programação dinâmica para encontrar o subconjunto
  const n = stones.length;
  const dp = Array(n + 1)
    .fill()
    .map(() => Array(2).fill(false));
  const subsets = Array(n + 1)
    .fill()
    .map(() => Array(2).fill([]));

  // Caso base: soma zero pode ser alcançada com conjunto vazio
  dp[0][0] = true;
  subsets[0][0] = [];

  for (let i = 1; i <= n; i++) {
    const currentStone = stones[i - 1];
    for (let j = 0; j < 2; j++) {
      // Verifica se podemos alcançar a soma sem incluir a pedra atual
      if (dp[i - 1][j]) {
        dp[i][j] = true;
        subsets[i][j] = subsets[i - 1][j];
      }

      // Verifica se podemos alcançar a soma incluindo a pedra atual
      const newSum = j + currentStone;
      if (newSum === 0 && dp[i - 1][0]) {
        return [...subsets[i - 1][0], currentStone];
      }
    }
  }

  return null;
}

/**
 * Processa a entrada do usuário e exibe o resultado com os cálculos
 */
function analyzeStones() {
  const input = document.getElementById('stonesInput').value.trim();
  const resultOutput = document.getElementById('resultOutput');

  resultOutput.innerHTML = '';

  if (!input) {
    resultOutput.innerHTML = '<p class="error">Por favor, insira as pedras mágicas.</p>';
    return;
  }

  try {
    const stones = input.split(',').map(item => {
      const num = parseInt(item.trim(), 10);
      if (isNaN(num)) throw new Error('Entrada inválida');
      return num;
    });

    const balancedSubset = findBalancedSubset(stones);

    if (balancedSubset) {
      const sumCalculation = balancedSubset.join(' + ') + ' = ' + balancedSubset.reduce((a, b) => a + b, 0);

      resultOutput.innerHTML = `
                <p class="success">VERDADEIRO (True)</p>
                <p>Foi encontrado um subconjunto equilibrado:</p>
                <p class="calculation">${sumCalculation}</p>
                <p>Subconjunto: [${balancedSubset.join(', ')}]</p>
                <p>Todas as pedras: [${stones.join(', ')}]</p>
            `;
    } else {
      // Mostra todas as combinações testadas (simplificado para exemplo)
      let combinationsTested = '';
      let found = false;

      // Testa combinações de 1 elemento
      for (let i = 0; i < stones.length; i++) {
        if (stones[i] === 0) {
          found = true;
          combinationsTested += `<p class="calculation">${stones[i]} = 0</p>`;
          break;
        }
      }

      if (!found) {
        // Testa combinações de 2 elementos
        for (let i = 0; i < stones.length; i++) {
          for (let j = i + 1; j < stones.length; j++) {
            const sum = stones[i] + stones[j];
            combinationsTested += `<p class="calculation">${stones[i]} + ${stones[j]} = ${sum}</p>`;
            if (sum === 0) found = true;
          }
        }
      }

      if (!found) {
        // Testa combinações de 3 elementos (para não ficar muito extenso)
        for (let i = 0; i < stones.length; i++) {
          for (let j = i + 1; j < stones.length; j++) {
            for (let k = j + 1; k < stones.length; k++) {
              const sum = stones[i] + stones[j] + stones[k];
              combinationsTested += `<p class="calculation">${stones[i]} + ${stones[j]} + ${stones[k]} = ${sum}</p>`;
              if (sum === 0) found = true;
            }
          }
        }
      }

      resultOutput.innerHTML = `
                <p class="error">FALSO (False)</p>
                <p>Nenhum subconjunto encontrado soma zero. Combinações testadas:</p>
                ${combinationsTested}
                <p>Todas as pedras: [${stones.join(', ')}]</p>
                ${
                  found
                    ? '<p class="success">OBS: Foi encontrada uma combinação que soma zero após a verificação</p>'
                    : ''
                }
            `;
    }
  } catch (error) {
    resultOutput.innerHTML = `<p class="error">Erro: ${error.message}. Por favor, insira números válidos separados por vírgulas.</p>`;
  }
}

/**
 * Reseta o formulário
 */
function resetForm() {
  document.getElementById('stonesInput').value = '';
  document.getElementById('resultOutput').innerHTML = '';
}

// Event listeners (mantido igual)
document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('analyzeBtn').addEventListener('click', analyzeStones);
  document.getElementById('resetBtn').addEventListener('click', resetForm);

  document.getElementById('stonesInput').addEventListener('keypress', e => {
    if (e.key === 'Enter') {
      analyzeStones();
    }
  });
});
