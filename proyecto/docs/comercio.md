# Pestaña Comercio: reglas y cálculos

Última revisión: 2026-11-13.

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
- Resultado documentado del 2026-11-13 08:16 con 25 de plata (referencia, con fuente).
- Qué ha cambiado: comparación con la subida anterior.
- Buscar un precio: buscador con botón «Usar» (rellena calculadora y libro).
- ¿Vendo el material o lo trabajo?: tabla por receta.
- Compras que te sirven a tu nivel.
- Calculadoras: subasta o vendedor; fabricar o vender.
- Libro de compras y ventas.

## Recetas que se evalúan (`RECETAS`)
- Fundir cobre: 1 mineral de cobre → 1 lingote. Minería 1.
- Fundir estaño: 1 mineral de estaño → 1 lingote. Minería 65.
- Fundir bronce: 1 lingote de cobre + 1 de estaño → 2 lingotes de bronce. Minería 65. El «2» es de Forever.
- Tornillos de cobre: 1 lingote de cobre → 1. Ingeniería 30.
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

## Cambios entre subidas
- Solo objetos con 20 o más a la venta en las dos subidas.
- Solo cambios del 15 % o más.
- Baja: mejor comprar que vender. Sube: mejor vender que comprar.

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
