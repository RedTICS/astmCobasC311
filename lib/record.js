var logger = require('winston');

var utils = require('./toolbox');


/***************************************
*             HeaderRecord             *
****************************************
* Sample header record text:
* H|\^&|||host^1|||||cobas c 311|TSDWN^BATCH|P|1
* 
**/
function HeaderRecord(record) {
    this.build = function (record) {

    }

    this.toASTM = function () {
        return [
            'H',
            [[null], [null, '&']],
            null,
            null,
            ['host', '1'],
            null,
            null,
            null,
            null,
            'cobas c 311',
            ['TSDWN', 'BATCH'],
            'P',
            '1'
        ];
    }
}


/***************************************
*           TerminationRecord          *
****************************************
* Sample termination record text:
* L|1|N
* 
**/
function TerminationRecord(record) {
    this.build = function (record) {

    }

    this.toASTM = function () {
        return ['L', '1', 'N'];
    }
}


/***************************************
*              PatientRecord           *
****************************************
* Sample patient record text:
* P|1||||||20070921|M||||||35^Y
* 
**/
function PatientRecord(record) {
    this.build = function (record) {

    }

    // this.toASTM = function (){
    // return [ 'P', '1',null,null,null,null,null,null,'U',null,null,null,null,null,[null,null]];
    // }

    this.toASTM = function () {
        return ['P', '1', null, null, null, null, null, null, this.sex, null, null, null, null, null, [null, null]];
    }
}


/***************************************
*           ResultRecord               *
****************************************
* Sample result record text:
* R|1|^^^458/|55|mg/dl||N||F|||||P1
* 
* Sample result record decoded:
* [ 'R','1',[ null, null, null, '458/' ],'55','mg/dl',null,'N',null,'F',null,null,null,null,'P1' ]
**/
function ResultRecord(record) {
    try {
        this.type = record[0];
        this.seq = record[1];
        this.test = record[2][3].slice(0, -1); // Remove last character '/' Este es el codigo COBAS de la prueba que está retornando el resultado.
        this.value = parseFloat(record[3]);
        this.units = record[4];
        // Others result record fields
        // references
        // abnormal_flag
        // abnormality_nature
        // status
        // norms_changed_at
        // operator
        this.started_at = record[11]; // started_at
        this.completed_at = record[12]; // completed_at
        this.instrument = record[13]; // instrument
    }
    catch (err) {
        logger.error('Cannot build ResultRecord.' + err);
        throw new Error(err);
    }

}



/****************************
* OrderRecord               *
***************************** 
* Sample order record text:

O|1|123456|0^^^^S1^SC|^^^570^\^^^717^\^^^418^\^^^690^\^^^798^\^^^435^\^^^781^|R||20190111102416||||A||||1||||||||||O (Download)
O|1|                123456|0^50005^005^^S1^SC|^^^717^\^^^418^\^^^798^\^^^570^\^^^435^\^^^690^\^^^781^|R||20190111102416||||N||||1|||||||20190111102948|||F (Upload)

*/
function OrderRecord() {
    this.build = function (record) {

        try {
            let orderParts = record.split('|');

            let [
                _RecordTypeID, // Fijo 'O'
                _SequenceNumber, // Normalmente '1', numero de secuencia de la Orden para un paciente dado 
                _SpecimenID, // Numero de protocolo 
                _InstrumentSpecimenID, // < SequenceNo>^<Rack ID>^<PositionNo>^^<SampleType>^<ContainerType> 
                _UniversalTestID, // ^^^<ApplicationCode>^<Dilution>\… indica en ID interno de test de cobas y la dilucion, se puede repetir hasta 100 veces, por lo gral dilucion va vacio
                _Priority, // 'R': routine sample. 'S': stat sample. (todo lo que no sea rutina entra como Urgencia) 
                _EmptyData7,
                _SpecimenCollectionDateAndTime, // YYYYMMDDHHMMSS Fecha y hora de recepcion de la muestra
                _EmptyData9,
                _EmptyData10,
                _EmptyData11,
                _ActionCode, // N|Q|A|C por lo gral N para upload y A para download
                _EmptyData13,
                _EmptyData14,
                _EmptyData15,
                _SpecimenDescriptor, // 1..5 numerico del 1 al 5
                _EmptyData18,
                _EmptyData19,
                _EmptyData20,
                _EmptyData21,
                _EmptyData22,
                _DateTimeResultsReportedOrLastModified, // YYYYMMDDHHMMSS Fecha y hora del resultado de la muestra
                _EmptyData24,
                _EmptyData25,
                _ReportType, // 'O': test order. (Download) 'F': communication of result. (Upload)
                _EmptyData27,
                _EmptyData28,
                _EmptyData29,
                _EmptyData30,
                _EmptyData31
            ] = orderParts;

            instrumentParts = _InstrumentSpecimenID.split('^');
            _SequenceNo = instrumentParts[0];
            _RackID = instrumentParts[1];
            _PositionNo = instrumentParts[2];
            _SampleType = instrumentParts[4];
            _ContainerType = instrumentParts[5];

            console.log('Record Type ID [O]:', _RecordTypeID);
            console.log('Sequence Number [1]:', _SequenceNumber);
            console.log('Specimen ID:', _SpecimenID);
            console.log('Instrument Specimen ID:', _InstrumentSpecimenID);
            console.log('Universal Test ID:', _UniversalTestID);
            console.log('Priority:', _Priority);
            console.log('Specimen Collection Date And Time:', _SpecimenCollectionDateAndTime);
            console.log('Action Code:', _ActionCode);
            console.log('Specimen Descriptor:', _SpecimenDescriptor);
            console.log('Date Time Results Reported Or Last Modified:', _DateTimeResultsReportedOrLastModified);
            console.log('Report Type:', _ReportType);

            console.log('Sequence Number:', _SequenceNo);
            console.log('Rack ID:', _RackID);
            console.log('Position Number:', _PositionNo);
            console.log('Sample Type:', _SampleType);
            console.log('Container Type:', _ContainerType);


            this.type = _RecordTypeID;
            this.seq = _SequenceNumber;
            this.sampleId = _SpecimenID;
            this.priority = _Priority;
            // this. = ('Specimen Collection Date And Time:', _SpecimenCollectionDateAndTime);
            this.actionCode = _ActionCode;
            this.biomaterial = _SpecimenDescriptor;
            this.dateTimeReported = _DateTimeResultsReportedOrLastModified;
            this.reportType = _ReportType;

            this.sequenceNumber = _SequenceNumber;
            this.rackID = _RackID;
            this.positionNumber = _PositionNo;
            this.sampleType = _SampleType;
            this.containerType = _ContainerType;
        }
        catch (err) {
            logger.error('Cannot build OrderRecord.' + err)
            throw new Error(err);
        }
    }


    this.toASTM = function () {
        var timestamp = utils.formatDate(new Date(), 'yyyyMMddHHmmss');
        return [
            'O',
            '1',
            this.sampleId, // Numero de protocolo
            [this.sequenceNumber, this.rackID, this.positionNumber, null, this.sampleType, this.containerType],//[ null, null, null, null, null,null], // [ '0', '50001', '001', null, 'S1','SC'], S1=Plasma, S2=Urine
            this.toASTMTestComponent(this.tests),
            this.priority,
            null,
            timestamp,                  // Indicates reception date and time of request.  Setting is as follows.  Deletable. YYYYMMDDHHMMSS
            null,
            null,
            null,
            'A',
            null,
            null,
            null,
            this.biomaterial,           // This field indicates the type of sample. 1=Plasma, 2=Urine
            null,
            null,
            null,
            null,
            null,
            null,
            null,
            null,
            null,
            'O'];
    }

    this.toASTMTestComponent = function (testArray) {
        var test = [null, null, null, testArray[0].id, null];
        if (testArray.length == 1) {
            return test;
        }
        else {
            return [test, this.toASTMTestComponent(testArray.slice(1))]
        }
    }
}

/***************************************
*              TestComponent           *
****************************************
* Use only for OrderRecord
* 
**/

function TestComponent(id) {
    this.id = id;
}



/***************************************
*              CommentRecord           *
****************************************
* Sample comment record text:
* C|1|I|                              ^                         ^                    ^               ^          |G
* 
**/
function CommentRecord(record) {
    this.build = function (record) {

    }

    this.toASTM = function () {
        return [
            'C',
            '1',
            'L',
            ['                              ', '                         ', '                    ', '               ', '          '],
            'G'];
    }
}





module.exports = {
    ResultRecord: ResultRecord,
    OrderRecord: OrderRecord,
    HeaderRecord: HeaderRecord,
    TerminationRecord: TerminationRecord,
    CommentRecord: CommentRecord,
    PatientRecord: PatientRecord,
    TestComponent: TestComponent,
};