# Prompts Iniciales para Claude Code

Prompts listos para copiar y pegar en tu sesión de Claude Code. Adaptados para proyectos Stellar en el contexto peruano.

---

## Arrancar un proyecto desde cero

### MVP de pagos con Stellar

```
Necesito crear una aplicación web que permita a usuarios peruanos enviar
pagos en USDC a través de Stellar. El stack es Next.js 15 con TypeScript
y Tailwind CSS. La wallet es Freighter.

Requisitos:
1. Conectar Freighter wallet
2. Mostrar balance de XLM y USDC
3. Formulario para enviar USDC a otra dirección Stellar
4. Historial de transacciones

Usamos Stellar testnet. Empieza con el plan de arquitectura antes de codear.
```

### DeFi dashboard

```
Quiero construir un dashboard DeFi que muestre información de protocolos
Stellar. El usuario conecta su Freighter wallet y ve:

1. Su balance de XLM, USDC y otros assets
2. Sus posiciones en Blend (lending/borrowing)
3. Liquidez aportada en Soroswap/Phoenix
4. Un resumen de ganancias/pérdidas

Stack: Next.js, TypeScript, Tailwind, stellar-sdk.
Red: testnet para desarrollo, pero la UI debe servir para mainnet después.
Planifica primero la arquitectura.
```

### Contrato Soroban personalizado

```
Necesito crear un contrato Soroban en Rust que implemente un sistema de
escrow simple:

1. Un usuario deposita USDC en el contrato
2. Define un beneficiario y una condición (timestamp)
3. Después del timestamp, el beneficiario puede retirar
4. Antes del timestamp, el depositante puede cancelar

Empieza con la estructura del contrato y los tests.
```

### Token personalizado en Soroban

```
Quiero crear un token personalizado en Soroban que represente puntos de
lealtad para un negocio peruano. El contrato debe:

1. Implementar la interfaz SEP-41 (token estándar de Soroban)
2. Permitir mint solo al admin del contrato
3. Permitir transfer y burn a cualquier holder
4. Tener un supply máximo configurable al desplegar

Stack: Rust + Soroban SDK. Empieza con la estructura del contrato,
los tests unitarios y el script de despliegue en testnet.
```

---

## Integración con el ecosistema peruano

### On/off ramp conceptual

```
Diseña la arquitectura (sin implementar el backend completo) para un
servicio que permita:

1. Un usuario deposita PEN vía transferencia bancaria (CCI interbancario
   o billeteras como Yape o Plin)
2. El servicio convierte a USDC en Stellar
3. El USDC se envía a la wallet del usuario

Necesito:
- Diagrama de flujo del proceso
- Interfaces TypeScript para cada paso
- Mock del frontend en Next.js
- Consideraciones de compliance para Perú (SBS, UIF, normativa de
  servicios de pago)

Esto es para una demo de hackathon, no producción.
```

### Remesas LatAm con origen en Perú

```
Quiero hacer una demo de remesas desde Perú a otro país de LatAm
usando Stellar como rail. El flujo es:

1. Emisor en Perú envía PEN
2. Se convierte a USDC en Stellar
3. El receptor en [país destino] recibe en su moneda local

Necesito un frontend que simule este flujo con datos mock para la demo.
Usa Next.js + TypeScript + Tailwind. Muestra las fees y el tipo de
cambio. Incluye un panel con el estado de la transacción en tiempo real.
```

### Integración con Yape / Plin (simulación)

```
Diseña un mock de integración entre una billetera peruana (Yape o Plin)
y Stellar. El flujo simulado es:

1. Usuario ingresa número de celular asociado a Yape/Plin
2. El sistema valida y genera una intención de pago mock
3. El monto en PEN se muestra convertido a USDC al tipo de cambio actual
4. Se simula la confirmación y el envío a la wallet Stellar del receptor

Todo debe ser mock/simulado — sin llamadas reales a Yape/Plin.
Usa Next.js + TypeScript. Muestra un UI realista con estados de carga
y confirmación para la demo.
```

### Pagos a proveedores con Stellar

```
Crea una demo de un sistema de pagos B2B para una empresa peruana que
quiere pagar a sus proveedores usando USDC en Stellar:

1. Panel de proveedores con nombre, RUC y dirección Stellar
2. Formulario para crear una orden de pago (monto en PEN, conversión a
   USDC automática)
3. Aprobación con Freighter wallet
4. Estado de cada pago en tiempo real via Horizon API

Stack: Next.js + TypeScript + Tailwind + stellar-sdk. Usa testnet.
Empieza con la arquitectura de componentes y el modelo de datos.
```

---

## Prompts para debugging

### Cuando algo no compila

```
Este contrato Soroban no compila. El error es:
[pega el error exacto aquí]

El código está en src/lib.rs. Revísalo y dime qué está mal y cómo
arreglarlo. Muéstrame el fix exacto con el código corregido.
```

### Cuando una transacción falla

```
Estoy intentando enviar USDC en Stellar testnet y la transacción falla
con este error:
[pega el error exacto aquí]

Mi código está en [archivo]. Necesito que:
1. Expliques por qué falla
2. Propongas el fix
3. Implementes el fix directamente en el archivo
```

### Cuando el frontend no conecta con Freighter

```
La conexión con Freighter wallet no funciona. Cuando hago click en
"Conectar Wallet" no pasa nada. El código está en [componente].

Revisa:
1. Que Freighter esté instalado y configurado en testnet
2. Que el código de conexión sea correcto (window.freighter API)
3. Que los event handlers estén bien configurados
4. Que no haya errores en la consola del navegador

Muéstrame qué cambiar y por qué.
```

### Cuando Horizon API devuelve resultados inesperados

```
La llamada a Horizon API está devolviendo datos incorrectos o vacíos.
El endpoint que uso es: [endpoint completo]
La respuesta que recibo es: [respuesta]
Lo que espero recibir es: [resultado esperado]

Mi código está en [archivo]. Revisa si estoy construyendo la query
correctamente y si estoy parseando la respuesta bien. Muéstrame el fix.
```

### Cuando un contrato Soroban devuelve error en invocación

```
Al invocar mi contrato Soroban desde el frontend recibo este error:
[pega el error exacto]

El contrato está desplegado en testnet con ID: [contract ID]
El código de invocación está en [archivo].

Necesito que:
1. Interpretes el error (puede ser un código de error de Soroban)
2. Identifiques si el error es en el contrato o en el cliente
3. Propongas e implementes el fix
```

---

## Prompts para la demo final

### Preparar la presentación

```
La hackathon termina en n horas. Necesito preparar mi demo:

1. Revisa el estado actual del proyecto y lista qué funciona y qué no
2. Prioriza: qué puedo arreglar en n horas para tener la mejor demo
3. Escríbeme un guión de demo de 3 minutos que muestre el flujo principal
4. Asegúrate de que el happy path funcione perfecto
5. Identifica qué partes puedo mostrar en "modo demo" aunque no estén
   100% terminadas (datos mock, estados hardcodeados, etc.)
```

### Limpiar para la entrega

```
Necesito preparar el repo para la entrega de la hackathon:

1. Asegúrate de que el README explique qué es el proyecto, el problema
   que resuelve y cómo correrlo localmente
2. Revisa que no haya API keys, seeds o secrets en el código
3. Verifica que las instrucciones de instalación funcionen desde cero
4. Agrega un .env.example con todas las variables necesarias
5. Asegúrate de que el proyecto corra con: npm install && npm run dev
```

### Generar el README del proyecto

```
Basándote en el código actual del proyecto, escríbeme un README.md
completo que incluya:

1. Título y descripción del proyecto (qué problema resuelve, para quién)
2. Demo screenshots o descripción del flujo principal
3. Stack tecnológico con versiones
4. Instrucciones de instalación paso a paso
5. Variables de entorno necesarias (sin valores reales)
6. Cómo correr los tests
7. Arquitectura del proyecto (breve)
8. Próximos pasos o features pendientes

El tono debe ser profesional pero accesible. El proyecto está en el
contexto de Stellar Build PE — Buildathon de Stellar en Perú.
```

### Preparar el pitch técnico

```
Ayúdame a preparar la parte técnica del pitch para los jueces de la
hackathon. Basándote en el código del proyecto:

1. Resume en 2-3 oraciones qué construí y por qué es relevante para
   el ecosistema Stellar
2. Lista las 3 decisiones técnicas más interesantes que tomé
3. Explica cómo usé Stellar (Soroban / Horizon / SEPs específicos)
4. Identifica qué haría diferente con más tiempo

El pitch técnico dura 2 minutos máximo.
```

---

## Tips para escribir buenos prompts

**Contexto primero:** Explica qué estás construyendo antes de pedir algo específico. Claude entiende mejor cuando sabe el objetivo completo.

**Sé específico:** `"Crea un hook useBalance que consulte el balance USDC via Horizon API y lo actualice cada 30 segundos"` es mucho mejor que `"haz el balance"`.

**Incluye errores completos:** Pega el error exacto tal como aparece en la terminal o consola. No lo parafrasees ni lo resumas.

**Un paso a la vez:** Mejor 5 prompts enfocados que 1 prompt gigante. Claude puede hacer muchas cosas a la vez, pero el output es más predecible y revisable en pasos pequeños.

**Referencia archivos:** `"En src/components/Wallet.tsx, línea 45, el botón de conexión no responde"` es más útil que `"el componente de la wallet no funciona"`.

**Pide el plan antes del código:** Para features complejas, empieza con `"Planifica cómo implementarías X"` antes de `"Implementa X"`. Así validas el enfoque antes de gastar tiempo en código.

**Aprovecha el contexto de CLAUDE.md:** Si tienes un `CLAUDE.md` bien configurado, Claude recuerda el stack, las convenciones y las decisiones técnicas del proyecto. Actualízalo cuando cambies algo importante.

**Cuando algo no funciona después de 3 intentos:** Cambia de estrategia. Pide que Claude explique su razonamiento o prueba un enfoque completamente diferente. A veces conviene hacer esa parte manualmente.

**Pide código production-ready:** Incluye en el prompt `"El código debe manejar errores correctamente y estar listo para mostrar en demo"` para que Claude no deje TODOs ni casos sin cubrir.

**Commits descriptivos:** Después de cada feature que funcione, pide `"Haz un commit con un mensaje descriptivo de lo que acabamos de implementar"`.
