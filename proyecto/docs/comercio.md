# Pestaña Comercio: reglas y cálculos

Última revisión: 2026-11-15.

## Reglas de la subasta de Forever
- Comisión al vender: 5 %. Fuente: EpicCarry. Comprobado: 2026-11-13.
- Depósito al publicar: 1 de plata como mínimo por anuncio. Fuentes: EpicCarry, Icy Veins. Comprobado: 2026-11-13.
- El depósito se devuelve si se vende.
- Si no se vende: las fuentes no coinciden. La web cuenta que se pierde (criterio prudente).
- Blizzard estudia bajar el mínimo a 1 de cobre. Sin fecha. Fuente: Icy Veins.
- Los dos valores se pueden cambiar en la página («Las reglas de la subasta»).

## Precio usado en los cálculos
- De cada objeto se usa el precio más bajo de la subida más reciente.
- Si no está en la subida: «precio pendiente».
- Se usa siempre la subida más reciente y se compara con la anterior.

## Tarjetas, en orden
- Las reglas de la subasta (comisión, depósito, presupuesto, precio por unidad).
- Subidas de precios: lista con fecha, origen y antigüedad; subir CSV.
- ¿En qué invierto ahora?: plan con el presupuesto en plata.
- Resultado documentado de AH2 (2026-11-15 17:44) con 25 de plata (referencia, con fuente).
- Qué ha cambiado: comparación con la subida anterior, con filtro y buscador.
- Tus anuncios: filas marcadas «Sí» en «¿Propiedad?».
- Buscar un precio: buscador con precio de la subida anterior y cambio; botón «Usar» (rellena calculadora y libro).
- ¿Vendo el material o lo trabajo?: tabla por receta.
- Compras que te sirven a tu nivel.
- Calculadoras: subasta o vendedor; fabricar o vender.
- Libro de compras y ventas.

## Recetas que se evalúan (`RECETAS`)
- Fundir cobre: 1 mineral de cobre → 1 lingote. Minería 1.
- Fundir estaño: 1 mineral de estaño → 1 lingote. Minería 65.
- Fundir bronce: 1 lingote de cobre + 1 de estaño → 2 lingotes de bronce. Minería 65. El «2» es de Forever.
- Tornillos de cobre: 1 lingote de cobre → 1 «Un puñado de tornillos de cobre» (nombre en la subasta; antes se buscaba «Tornillos de cobre» y salía «precio pendiente»). Ingeniería 30.
- Pólvora férrea: 1 piedra basta → 1. Ingeniería 1.
- Pólvora burda: 1 piedra burda → 1. Ingeniería 75.
- Piedra de afilar férrea: 1 piedra basta → 1. Herrería 1.
- Contacto de plata: 1 lingote de plata → 1. Ingeniería 90.
- Tubo de bronce: 2 lingotes de bronce + 1 flujo débil → 1. Ingeniería 105.
- Venda de lino: 1 paño de lino → 1. Primeros auxilios 1.
- Venda de lino pesado: 2 paños de lino → 1. Primeros auxilios 40.
- Cocinar pececito luminoso: 1 crudo → 1. Cocina 1.
- Aviso: cantidades y habilidades son de Classic. Sin confirmar en Forever, salvo el bronce doble.

## Cálculo «material o trabajo»
- Vender el material = suma de precios de los materiales × (1 − comisión).
- Trabajarlo = precio del resultado × cantidad × (1 − comisión).
- Veredicto:
  - Gana más del 10 %: «trabájalo».
  - Entre 0 y 10 %: «casi igual».
  - Menos de 0: «vende el material».
  - Falta algún precio: «precio pendiente».
- «¿Puedes?»: compara la habilidad apuntada con la que pide la receta.
  - Habilidad sin apuntar (0): «comprueba tu…».
  - Profesión que no es de Fissel: «no es tu profesión».

## Plan de inversión (`planHacer`)
- Entrada: presupuesto en plata (`S.sub.pres`).
- Solo propone comprar materiales, trabajarlos y vender el resultado.
- Pasos:
  1. Recetas con beneficio positivo que Fissel puede hacer (o sin comprobar). Las de «no todavía» quedan fuera.
  2. Ordenar por rentabilidad (beneficio / coste), de mayor a menor.
  3. Para cada una, unidades = el menor de: lo que permite el presupuesto, el 15 % de lo que hay a la venta del resultado, los materiales disponibles.
  4. Restar el coste y seguir con la siguiente.
- Salida: qué comprar, cuánto se gasta, qué fabricar, ganancia y lo que sobra.
- Ganancia de cada paso = lo que se cobra (precio × cantidad × (1 − comisión)) − lo que se paga por los materiales. Rentabilidad = ganancia / coste.
- El 15 % se cuenta en unidades del resultado: si la receta da 2, el tope de recetas es la mitad.
- Límite de materiales: no se propone comprar más de lo que hay a la venta.
- Salida final: «Inviertes X. Recuperas Y. Ganancia total Z. Sobra S».
- Si nada da beneficio: «no inviertas hoy».
- No propone revender sin trabajar: hacen falta dos subidas para saber qué está barato.
- Riesgos que se muestran: no vender (depósito) y precios cambiados desde la subida.
- Con el extracto: la disponibilidad está pendiente; el límite del 15 % no se puede aplicar y se avisa.
- Antigüedad: más de 6 horas, aviso naranja; más de 24 horas, aviso rojo «precios viejos».

## Resultado documentado con la subida del 2026-11-13 08:16 y 25 de plata
- Comprar 62 piedras bastas (6 de plata, 20 de cobre) → 62 pólvoras férreas. Ganancia: 5 de plata, 58 de cobre.
- Comprar 8 lingotes de cobre y 8 de estaño (18 de plata, 80 de cobre) → 16 lingotes de bronce. Ganancia: 9 de plata, 93 de cobre.
- Total: invierte 25 de plata, recupera 40 de plata y 51 de cobre.
- No hacer para vender: fundir cobre, fundir estaño, contacto de plata, vendas de lino, cocinar pececito.
- Precios clave: mineral de cobre 1,49 de plata; lingote de cobre 1,35; lingote de estaño 1,00; lingote de bronce 1,89; piedra basta 0,10; pólvora férrea 0,20; paño de lino 0,24; bolsa de lino 2,20.

## Resultado con la subida AH1 (3.823 objetos, recibida 2026-11-13 21:27 UTC) y 25 de plata
- Con las habilidades apuntadas (Minería 56): comprar 54 piedras bastas (5 pl. 40) → 54 pólvoras férreas. Ganancia 4 pl. 35. Sobran 19 pl. 60. Limitado por el 15 % de las 365 pólvoras a la venta.
- Con Minería 65 (regresión): 13 lingotes de cobre + 13 de estaño (24 pl. 70) → 26 de bronce, ganancia 21 pl. 98; más 3 pólvoras. Total recupera 47 pl. 22, ganancia 22 pl. 22.
- Precios clave en AH1: mineral de cobre 94; lingote de cobre 90; lingote de estaño 100 (167 a la venta); lingote de bronce 189; piedra basta 10; pólvora férrea 19; paño de lino 20; bolsa de lino 201 (cobre por unidad).
- «Qué ha cambiado» no compara AH1 con el extracto AH0 (el extracto no tiene disponibilidad). Habrá comparación desde la siguiente subida completa.

## Resultado con la subida AH2 (4.634 objetos, recibida 2026-11-15 17:44 UTC) y 25 de plata
- Con las habilidades apuntadas (Minería 56): comprar 86 piedras bastas (3 pl. 44) → 86 pólvoras férreas. Recupera 12 pl. 26, ganancia 8 pl. 82. Sobran 21 pl. 56. Limitado por el 15 % de las 579 pólvoras a la venta.
- Con Minería 65 (regresión, vale para AH2): 86 pólvoras (8 pl. 82) + 8 lingotes de cobre y 8 de estaño (19 pl. 84) → 16 de bronce (7 pl. 6) + 1 mineral de estaño → 1 lingote (18 cobre). Invierte 24 pl. 75, recupera 40 pl. 81, ganancia 16 pl. 6.
- Precios clave en AH2 (cobre por unidad, entre paréntesis a la venta): mineral de cobre 85 (1.143, propio); lingote de cobre 74 (1.980); mineral de estaño 147 (1.800); lingote de estaño 174 (1.102); lingote de bronce 177 (3.528); piedra basta 4 (3.976); pólvora férrea 15 (579); paño de lino 23 (3.671); bolsa de lino 213 (151).
- «Qué ha cambiado» compara ya AH2 con AH1.

## Resultado con AH3 (4.731 objetos, 2026-11-15 21:15 UTC), Minería 80, Ingeniería 43 (valores por defecto) y 25 de plata
- 12 puñados de tornillos (14 pl. 1), 10 lingotes de bronce (4 pl. 65) y 7 pólvoras (2 cobre). Invierte 24 pl. 97, recupera 43 pl. 65, ganancia 18 pl. 68.
- AH2 → AH3: 142 cambios ≥15 % (101 bajan, 41 suben); 7 de «lo que te importa».

## Resultado con AH5 (4.514 objetos, 2026-11-17 18:18 UTC), valores por defecto (Minería 80, Ingeniería 43) y 25 de plata
- Regresión (estado limpio): 159 pólvoras férreas (compra 159 piedras bastas por 17 pl. 49; cobra 1 o. 13 pl. 29; ganancia 95 pl. 80) y 7 puñados de tornillos (coste 7 pl.; ganancia 5 pl. 17). Sobran 51 cobres.
- Ojo: esa ganancia sale de que la pólvora férrea pasó de 15 a 75 cobres (es el precio más bajo, con 1.062 a la venta). No está asegurado que se vendan 159 más a ese precio.

## Resultado con AH6 (5.456 objetos, 2026-11-20 22:20 UTC), valores por defecto y 25 de plata
- Regresión (estado limpio): 231 pólvoras férreas (231 piedras bastas, 9 pl. 24; ganancia 45 pl. 62), 12 puñados de tornillos (12 lingotes de cobre, 10 pl. 80; ganancia 23 pl. 29), 2 lingotes de bronce (ganancia 58 cobre) y 1 lingote de estaño (11 cobre). Invierte 24 pl. 24, recupera 93 pl. 84, ganancia 69 pl. 60. Sobran 76 cobres.
- La pólvora férrea bajó de 75 a 25 cobres y hay 1.543 a la venta: el margen es real, pero vender 231 lleva tiempo.

## Cambios entre subidas
- Solo objetos con 20 o más a la venta en las dos subidas.
- Solo cambios del 15 % o más.
- Baja: mejor comprar que vender. Sube: mejor vender que comprar.
- Solo entre dos subidas completas (el extracto no cuenta). Se compara el precio más bajo de cada nombre (`ahIdx`) y las unidades totales.
- Arriba, resumen: cuántos objetos cambian, cuántos bajan y cuántos suben.
- Filtro «Mostrar» (2026-11-15):
  - «Lo que te importa» (por defecto): materiales y resultados de `RECETAS`, almacén y libro (`nombresMios`).
  - «Lo que baja», «Lo que sube», «Todo».
- Filtro por nombre (parte del nombre).
- Orden: del cambio más grande al más pequeño. Se muestran 25; botón «Mostrar los N» para verlos todos.
- Columna «A la venta (antes → ahora)».
- Resultado con AH1 → AH2: 357 objetos cambian (239 bajan, 118 suben); 12 de «lo que te importa».
- Aviso fijo: con dos subidas no se sabe si el cambio durará.

## Buscar un precio
- Si hay subida anterior completa: columnas «Subida anterior» (o «no estaba») y «Cambio».

## Oportunidades: comprar barato y revender (2026-11-15)
- Usa todas las subidas completas (`ahCompletas()`); hacen falta 3 o más.
- Condiciones: no es equipo con sufijo; está en todas las subidas; 30 o menos a la venta ahora; comprarlo todo (precio más bajo × unidades, es un mínimo) cabe en «Tengo para invertir»; precio de ahora × 1,3 ≤ el más bajo de los precios de las subidas anteriores (cambiado de mediana a mínimo el 2026-11-15: la mediana se disparaba con anuncios caros aislados).
- «Revender a» = el más bajo de los precios de las subidas anteriores. Ganancia = revender × unidades × (1 − comisión) − comprarlo todo. Sin depósitos.
- Orden: más ganancia primero; 15 filas como máximo. Filtro «Todo» / «Lo que te importa».
- Límites: la exportación no dice quién vende ni cuánto se vende. Con 3 subidas la mediana sale de 2 precios y un anuncio caro aislado la dispara (p. ej. «1 oro → 10 pl. → 10 pl.»): revisar la columna de historial antes de comprar.
- Con AH1–AH3 (regla de mínimo): 10 candidatos con hasta 1 oro, casi todos recetas y patrones de nicho; el mayor, «Fórmula: Encantar torso: intelecto menor» (15 a 6 pl., antes 20 y 12 pl.).

## Tus anuncios
- Filas de la subida más reciente con «Sí» en «¿Propiedad?»: precio más bajo, unidades totales, subida anterior y cambio.
- Qué significa exactamente «Sí» (si el precio más bajo es el tuyo o solo que tienes algo puesto): pendiente de confirmar.
- Con AH2: 9 filas.

## Plan en la pestaña Hoy
- Se calcula en vivo con `planCalc()` (el mismo cálculo que Comercio) sobre la subida más reciente y el presupuesto apuntado. Antes era un texto fijo del 2026-11-13.
- Con AH2, Minería 56 y 25 de plata: fabricar 86 pólvoras férreas, invertir 3 pl. 44 y ganar 8 pl. 82.

## Compras de equipo
- Sufijos buenos para chamán Mejora: del gorila, de fuerza, del jabalí, del oso, del tigre, de poder.
- Nivel que pide: entre el nivel del personaje − 4 y + 1.
- La exportación no dice el tipo de armadura. Aviso fijo: comprobar que sea cuero o tela (malla desde el nivel 40).
- Cómo se calcula (`comprasEquipo`): nombre que contiene uno de los sufijos, nivel entre paréntesis dentro del rango, no propio y con unidades a la venta. Orden: de más barato a más caro. Máximo 25.
- Con el extracto no hay equipo: se dice y se pide el CSV completo.
- Se muestra igual en la pestaña Equipo y en Comercio.

## Almacén, libro y montura (cálculos)
- Almacén: valor = cantidad × precio más bajo de la última subida. Total con y sin comisión. Sin precio: «pendiente».
- Libro: compras, ventas, ventas sin comisión y balance. No cuenta depósitos perdidos ni ventas al vendedor.
- Montura: último apunte de plata frente a 100 de oro (dato de beta, EpicCarry).

## Buscador
- Orden: de más barato a más caro. Máximo 25; si hay más, se dice cuántos.
- «Usar» rellena la calculadora, el objeto del libro y su precio por unidad.
