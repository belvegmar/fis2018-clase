
var chai = require('chai');
var expect = chai.expect;

//Con esta prueba vamos a intentar probar nuestro servidor
describe("Contacts API", () =>{
    it('hola mundo de prueba', (done)=> {
        var x = 3;
        var y = 5; //Configuro mis datos de prueba
        
        var resultado = x + y; //Código que se está probando

        expect(resultado).to.equal(8); //Comprobación
        done();

    });
});