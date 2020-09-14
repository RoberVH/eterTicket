
var config=require('./configuracion');

module.exports =   function valusuario(user) {
     //console.log('comparando: registrado', user.username, ' - ', user.passw, ' contra:');
     //console.log(config.usuarios.length)
     for (let i=0;i<config.usuarios.length;i++) {
      //console.log('i= ', i, ': ', config.usuarios[i].username, ' - ', config.usuarios[i].passw);
       if (config.usuarios[i].username==user.username && config.usuarios[i].passw==user.passw) {
            return ({status: true,nivel:config.usuarios[i].nivel,nocte:config.usuarios[i].nocliente});
       }
     }
     return false;
}