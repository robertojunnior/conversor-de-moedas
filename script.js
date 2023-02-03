const converterBtn = document.getElementById("converterBtn");
converterBtn.addEventListener("click", function () {
  const valor = document.getElementById("valor").value;
  const moeda1 = document.getElementById("moeda1").value;
  const moeda2 = document.getElementById("moeda2").value;

  fetch(`https://api.exchangerate-api.com/v4/latest/${moeda1}`)
    .then(response => response.json())
    .then(data => {
      const exchangeRate = data.rates[moeda2];
      const valorConvertido = (valor * exchangeRate).toFixed(2);
      document.getElementById("resultado").innerHTML = `${valor} ${moeda1} = ${valorConvertido} ${moeda2}`;
    });
});
