const PDF = require('pdfkit-construct');

const format = require('date-fns/format');
const es = require('date-fns/locale/es');

class Historial_Pago {

    constructor(precio_servicio = 0, nombreCliente = '', nombreNutriologo = '') {
        this.precio_servicio = precio_servicio;
        this.nombreCliente = nombreCliente;
        this.nombreNutriologo = nombreNutriologo;
        this.fecha_pago = new Date();
    }

    formatFecha() {
        return format(this.fecha_pago, 'dd-MMMM-yyyy', {locale: es});
    }

    toArray() {

        const fechaArr = this.formatFecha().split('-');
        const fechaString = fechaArr[0] + ' de ' + fechaArr[1] + ' del ' + fechaArr[2];

        let arreglo = [
            {
                tipo: 'Fecha de pago',
                valor: fechaString
            },
            {
                tipo: 'Cita con el nutriólogo',
                valor: this.precio_servicio
            }
        ];

        return arreglo;
    }

    toPDF() {

        //Crear el documento permitiendo que se pueda crear el archivo de salida
        const doc = new PDF({bufferPage: true});

        //Dieta semanal
        // Logo jopaka
        doc.image(__dirname + '/../src/JOPAKA_LOGO.png', 480, 730, {scale: 0.04})
        doc.fontSize(20);
        doc.text('Datos de compra', {
            align: 'center'
        });

        doc.fontSize(12);
        doc.text('\n\n\n\nComprador: ' + this.nombreCliente, {
            align: 'left'
        });
        doc.text('\n\nNutriólogo: ' + this.nombreNutriologo, {
            align: 'left'
        });
        doc.text('\n\nMétodo de pago: PAYPAL', {
            align: 'left'
        });

        // set the header to render in every page
        doc.setDocumentHeader({ height : "40%" }, () => {

        });

        doc.addTable([
            {key: 'tipo', label: 'Dato', align: 'center'},
            {key: 'valor', label: 'Valor', align: 'center'}
        ], this.toArray(), {
            border: null,
            width: "fill_body",
            striped: true,
            stripedColors: ["#FFFFFF", "#E1F3B0"],
            cellsPadding: 10,
            marginLeft: 45,
            marginRight: 45,
            headAlign: 'center',
            headBackground : '#D5ED96',
        });

        doc.render();

        return doc;
    }
}

module.exports = Historial_Pago;