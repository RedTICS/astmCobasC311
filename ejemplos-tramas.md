# H1 Ejemplos de tramas de Cobas C311

La comunicación con cobas consiste en el envio y recepcion de _mensajes_ que se componen de _registros_ y a su vez cada registro se puede dividir en _tramas_ si el registro excede la longitud de 240 bytes. cada trama comienza con un [STX] y le sigue un numero que indica el orden de la trama dentro del mensaje, las tramas intermedias terminan con un [ETB] y la trama final debe terminar con [ETX].
Caracteres especiales usados en el texto del mensaje:

* | separador campos

* \ indicador de repeticion de un mismo dato

* ^ separador de componentes dentro de un campo

* & caracter para escapar caracteres especiales dentro del texto del mensaje, &^& (escapando el separador de componentes)


*Ejemplo de comunicacion*

_Peticion de realizacion de distintos test_
```
[STX]1H|\^&|||host^1|||||cobas c 311|TSDWN^BATCH|P|1[CR]
P|1|||||||M||||||^[CR]
O|1|123456|0^^^^S1^SC|^^^570^\^^^717^\^^^418^\^^^690^\^^^798^\^^^435^\^^^781^|R||20190111102416||||A||||1||||||||||O[CR]
C|1|L|                              ^                    [ETB]15[CR][LF]
[STX]2     ^                    ^               ^          |G[CR]
L|1|N[CR]
[ETX]2F[CR][LF]
```
Disección de lo anterior:
La peticion esta compuesta por distintas partes
* Encabezado:

  `H|\^&|||host^1|||||cobas c 311|TSDWN^BATCH|P|1`
  + H => indicador de encabezado
  + \\^&| => definicion de caracteres especiales que se van a usar como delimitadores de información
  + host^1 => nombre de quien envia el mensaje
  + cobas c 311 => nombre del destinatario del mensaje
  + TSDWN^BATCH => tipo de mensaje y modo de envio del mensaje, TSDWN orden de ejecución pruebas enviada a cobas en modo BATCH 
  + P => dato fijo
  + 1 => dato fijo
   
* Paciente:
  
  `P|1|||||||M||||||^`
  + P => indicador de paciente
  + 1 => dato fijo
  + M => sexo [M Masculino | F Femenino | U Desconocido]
* Orden:
  
  `O|1|123456|0^^^^S1^SC|^^^570^\^^^717^\^^^418^\^^^690^\^^^798^\^^^435^\^^^781^|R||20190111102416||||A||||1||||||||||O`
  + O => indicador de orden de pruebas
  + 1 => indicador ordinal de paciente, generalmente 1
  + 123456 => Numero de protocolo
  + 0^^^^S1^SC => 0^^^^Tipo de Muestra^Tamaño del tubo
  + ^^^570^\\^^^717^\\... pruebas a realizar separando la lista de pruebas con un caracter \\ de separacion de componentes
  + R => prioridad de las pruebas [R Rutina | S Urgencia]
  + 20190111102416 => fecha de la muestra
  + A => codigo de acción, en este caso orden de pruebas desde el host
  + 1 => tipo de muestra [1 Serum/Plasma | 2 Urine | 3 CSF | 4 Suprnt | 5 Others]
  + O => tipo de comunicación [O orden de pruebas. (Download) | F comunicación de resultados (Upload)]
* Comentario:
  
  `C|1|L|                              ^                    [ETB]15[CR][LF][STX]2     ^                    ^               ^          |G[CR]`
  + C => indicador de comentario
  + 1 => dato fijo
  + L => origen del comentario [L enviado por el host | I enviado por el analizador ]
  + ^[ETB]15[CR][LF][STX]2^^^ => texto del comentario, en este caso termina la primer trama con [ETB], vienen caracteres de control 15[CR][LF] y comienza una nueva trama [STX]2 
  + G => dato fijo
* Terminador:
  
  `L|1|N`
  + normalmente estos datos son fijos
* Caracteres de control:
  
  `2F`
  + sumatoria de control (check sum) definida por los 2 últimos caracteres de la suma hexadecimal de todos los datos contenidos entre el numero de trama y los terminadores [ETB] o [ETX] (segun corresponda), en este ejemplo tenemos un check sum de 15 para la primer trama y otro de 2F para la segunda


_Respuesta de cobas_
```
[STX]1H|\^&|||H7600^1|||||host|RSUPL^REAL|P|1[CR]
P|1|||||||U||||||^[CR]
O|1|                123456|0^50005^005^^S1^SC|^^^717^\^^^418^\^^^798^\^^^570^\^^^435^\^^^690^\^^^781^|R||20190111102416||||N||||1|||||||20190111102948|||F[CR]
C|1|I|                    [ETB]F3[CR][LF]
[STX]2          ^^^^|G[CR]
R|1|^^^717/|298|mg/dl||N||F||      |||P1[CR]
C|1|I|0|I[CR]
R|2|^^^418/|29|mg/dl||N||F||      |||P1[CR]
C|1|I|0|I[CR]
R|3|^^^798/|344|mg/dl||N||F||      |||P1[CR]
C|1|I|0|I[CR]
R|4|^^^570/|78|U/l||N||F||      |||P1[CR]
C|1|I|0|I[CR]
R|5|^^^435/|29|mg/dl||N[ETB]6C[CR][LF]
[STX]3||F||      |||P1[CR]
C|1|I|0|I[CR]
R|6|^^^690/|0.85|mg/dl||N||F||      |||P1[CR]
C|1|I|0|I[CR]
R|7|^^^781/|1078|mg/dl||HH||F||      |||P1[CR]
C|1|I|26|I[CR]
L|1|N[CR]
[ETX]90[CR][LF]
```
Disección de lo anterior:
* Encabezado:

  `H|\^&|||H7600^1|||||host|RSUPL^REAL|P|1`
  + H7600^1 => nombre de quien envia el mensaje
  + host => nombre del destinatario del mensaje
  + RSUPL^REAL => tipo de mensaje y modo de envio del mensaje, RSUPL Upload de Resultados en tiempo REAL
* Paciente:
  
  `P|1|||||||U||||||^`
* Orden:

  `O|1|                123456|0^50005^005^^S1^SC|^^^717^\^^^418^\^^^798^\^^^570^\^^^435^\^^^690^\^^^781^|R||20190111102416||||N||||1|||||||20190111102948|||F`
  + 123456 => Numero de protocolo
  + 0^50005^005^^S1^SC => 0^50Ubicación en el analizador^Ubicación en el analizador^^Tipo de Muestra^Tamaño del tubo
  + ...
  + 20190111102416 => fecha de la muestra
  + N => codigo de acción, en este caso el resultado de una orden de pruebas desde el analizador
  + 1 => tipo de muestra [1 Serum/Plasma | 2 Urine | 3 CSF | 4 Suprnt | 5 Others]
  + 20190111102948 => fecha y hora del resultado
  + F => tipo de comunicación [O orden de pruebas. (Download) | F comunicación de resultados (Upload)]
* Resultado:
  `R|1|^^^717/|298|mg/dl||N||F||      |||P1`
  + R => indicador de resultado
  + 1 => orden del resultado
  + ^^^717/ => test para el que se calculó el resultado que devuelve el analizador
  + 298 => resultado para el test
  + mg/dl => unidad de medida del resultado
  + N => indicador de estado de terminacion del resultado
  + F => tipo de resultado [F primer resultado | C resultado de una nueva ejecución del test (rerun)]
  + P1 => modulo del analizador que devuelve el resultado [P1 Fotométrica | ISE1 Electrodo selectivo de iones | Non resultado calculado] 

_Rerun del test 781 con valores por fuera del rango normal_
```
[STX]1H|\^&|||H7600^1|||||host|RSUPL^REAL|P|1[CR]
P|1|||||||U||||||^[CR]
O|1|                123456|0^50005^005^^S1^SC|^^^781^dec|R||20190111102416||||N||||1|||||||20190111112156|||F[CR]
C|1|I|                              ^^^^|G[CR]
R|1|^^^781/dec|1157|mg/dl||N[ETB]5B[CR][LF]
[STX]2||C||      |||P1[CR]
C|1|I|0|I[CR]
L|1|N[CR]
[ETX]2D[CR][LF]
```

_caracteres no imprimibles_

+ [STX] inicio de la transmision
+ [CR] retorno de carro
+ [LF] nueva linea
+ [ETB] fin de trama
+ [ETX] fin del mensaje


