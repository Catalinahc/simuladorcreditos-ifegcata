const SALARIO_MINIMO = 1423500;
const CREDITOS = {
  educativo: { tasaMensual: 0.015, maxPlazo: 6 },
  agropecuario: { tasaMensual: 0.02, maxPlazo: 18 },
  microempresarial: { tasaMensual: 0.02, maxPlazo: 18 },
  asociativo: { tasaMensual: 0.02, maxPlazo: 18 },
};

const formatoMoneda = (valor) =>
  valor.toLocaleString("es-CO", {
    style: "currency",
    currency: "COP",
    minimumFractionDigits: 0,
  });

const tipoCredito = document.getElementById("tipoCredito");
const montoInput = document.getElementById("monto");
const plazoInput = document.getElementById("plazo");
const tasaInteres = document.getElementById("tasaInteres");
const errorPlazo = document.getElementById("errorPlazo");
const tablaContainer = document.getElementById("tablaAmortizacion");
const honorarios = document.getElementById("honorarios");

tipoCredito.addEventListener("change", actualizarTasa);

function actualizarTasa() {
  const credito = CREDITOS[tipoCredito.value];
  tasaInteres.textContent = (credito.tasaMensual * 100).toFixed(2) + "%";
}

document.getElementById("calcular").addEventListener("click", () => {
  const tipo = tipoCredito.value;
  const monto = Number(montoInput.value);
  const plazo = Number(plazoInput.value);
  const credito = CREDITOS[tipo];

  if (!monto || monto <= 0) {
    alert("Por favor, ingresa un monto válido.");
    return;
  }

  if (plazo < 1) {
    errorPlazo.textContent = "El plazo mínimo es de 1 mes.";
    return;
  }

  if (plazo > credito.maxPlazo) {
    errorPlazo.textContent = `El plazo máximo para este crédito es de ${credito.maxPlazo} meses.`;
    tablaContainer.innerHTML = "";
    return;
  }

  errorPlazo.textContent = "";

  const tasa = credito.tasaMensual;
  const cuota = (monto * tasa) / (1 - Math.pow(1 + tasa, -plazo));
  let saldo = monto;
  let rows = "";

  for (let i = 1; i <= plazo; i++) {
    const interes = saldo * tasa;
    const abonoCapital = cuota - interes;
    const saldoFinal = saldo - abonoCapital;

    rows += `
      <tr class="text-center">
        <td class="border px-3 py-2">${i}</td>
        <td class="border px-3 py-2">${formatoMoneda(saldo)}</td>
        <td class="border px-3 py-2">${formatoMoneda(interes)}</td>
        <td class="border px-3 py-2">${formatoMoneda(abonoCapital)}</td>
        <td class="border px-3 py-2">${formatoMoneda(cuota)}</td>
        <td class="border px-3 py-2">${formatoMoneda(saldoFinal > 0 ? saldoFinal : 0)}</td>
      </tr>
    `;
    saldo = saldoFinal;
  }

  tablaContainer.innerHTML = `
    <h2 class="text-xl font-semibold text-gray-800 mb-2">Tabla de Amortización</h2>
    <table class="min-w-full bg-white border border-gray-200 text-sm">
      <thead class="bg-gray-100 text-gray-700">
        <tr>
          <th class="border px-3 py-2">Mes</th>
          <th class="border px-3 py-2">Saldo Inicial</th>
          <th class="border px-3 py-2">Intereses</th>
          <th class="border px-3 py-2">Abono Capital</th>
          <th class="border px-3 py-2">Cuota</th>
          <th class="border px-3 py-2">Saldo Final</th>
        </tr>
      </thead>
      <tbody>${rows}</tbody>
    </table>
  `;

  const esMayorCuatroSMLV = monto >= SALARIO_MINIMO * 4;
  const porcentajeAnual = esMayorCuatroSMLV ? 0.045 : 0.075;
  honorarios.textContent = "Honorarios: " + formatoMoneda(monto * porcentajeAnual);

  document.getElementById("informacionCredito").innerHTML = `
    <div class="mt-4 p-4 bg-yellow-100 border-l-4 border-yellow-500 text-yellow-800 rounded shadow">
      <p>
        El crédito educativo tiene un plazo máximo de <strong>6 meses</strong> y una tasa del <strong>1.5% mensual</strong>.<br>
        Los demás créditos tienen un plazo máximo de <strong>18 meses</strong> y una tasa del <strong>2% mensual</strong>.
      </p>
    </div>
  `;
});

document.getElementById("limpiar").addEventListener("click", () => {
  montoInput.value = "";
  plazoInput.value = 1;
  errorPlazo.textContent = "";
  tablaContainer.innerHTML = "";
  honorarios.textContent = "$0";
  document.getElementById("informacionCredito").innerHTML = "";
  actualizarTasa();
});
