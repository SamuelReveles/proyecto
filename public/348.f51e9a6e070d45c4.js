"use strict";(self.webpackChunkjopaka=self.webpackChunkjopaka||[]).push([[348],{3348:(dt,g,c)=>{c.r(g),c.d(g,{CuentaClientModule:()=>st});var d=c(9808),a=c(3075),p=c(1083),_=c(5861),t=c(5e3),u=c(9603),C=c(87),m=c(7261),f=c(7531),h=c(773);function v(n,o){1&n&&(t.TgZ(0,"div",7)(1,"div",8),t._uU(2," No puedes acceder a tu configuraci\xf3n debido a que tu cuenta se encuentra temporalmente suspendida. "),t.qZA()())}function b(n,o){if(1&n){const e=t.EpF();t.TgZ(0,"div",33)(1,"button",34),t.NdJ("click",function(){t.CHM(e),t.oxw();const r=t.MAs(19);return t.oxw(2).generarCodigo(r.value)})("click",function(){return t.CHM(e),t.oxw(3).counter=1}),t._uU(2,"Enviar c\xf3digo"),t.qZA()()}if(2&n){const e=t.oxw(3);t.xp6(1),t.Q6J("disabled",e.deshabilitar)}}function Z(n,o){if(1&n){const e=t.EpF();t.TgZ(0,"div",9)(1,"h4"),t._uU(2,"VALIDACI\xd3N DE CELULAR"),t.qZA(),t.TgZ(3,"div",10)(4,"span",11),t._uU(5,"Token"),t.qZA(),t.TgZ(6,"form",35)(7,"div",14)(8,"div",36),t._UZ(9,"input",37,38),t.qZA(),t.TgZ(11,"div",39)(12,"div",40)(13,"button",34),t.NdJ("click",function(){t.CHM(e);const r=t.MAs(10);return t.oxw(3).verificarCodigo(r.value)}),t._uU(14,"Verificar token"),t.qZA()(),t.TgZ(15,"div",33)(16,"button",34),t.NdJ("click",function(){return t.CHM(e),t.oxw(3).start()})("click",function(){t.CHM(e),t.oxw();const r=t.MAs(19);return t.oxw(2).generarCodigo(r.value)}),t._uU(17,"Reenviar c\xf3digo"),t.qZA()(),t.TgZ(18,"div",41)(19,"p"),t._uU(20),t.qZA()()()()()()()}if(2&n){const e=t.MAs(10),i=t.oxw(3);t.xp6(6),t.Q6J("formGroup",i.tokenFormGroup),t.xp6(7),t.Q6J("disabled",e.value.length<6),t.xp6(3),t.Q6J("disabled",i.deshabilitar||0==i.counter),t.xp6(4),t.hij(" ",i.segundos," seg")}}function O(n,o){if(1&n){const e=t.EpF();t.TgZ(0,"div",7)(1,"h4"),t._uU(2,"Configuraci\xf3n de perf\xedl"),t.qZA(),t.TgZ(3,"div",9)(4,"h4"),t._uU(5,"DATOS GENERALES"),t.qZA(),t.TgZ(6,"div",10)(7,"span",11),t._uU(8,"Nombre"),t.qZA(),t._UZ(9,"input",12),t.qZA(),t.TgZ(10,"div",10)(11,"span",11),t._uU(12,"Apellidos"),t.qZA(),t._UZ(13,"input",13),t.qZA(),t.TgZ(14,"div",10)(15,"span",11),t._uU(16,"N\xfamero celular"),t.qZA(),t.TgZ(17,"div",14),t._UZ(18,"input",15,16),t.YNc(20,b,3,1,"div",17),t.qZA()()(),t.YNc(21,Z,21,4,"div",18),t._UZ(22,"hr"),t.TgZ(23,"div",9)(24,"h4"),t._uU(25,"FOTO DE PERFIL"),t.qZA(),t.TgZ(26,"input",19),t.NdJ("change",function(r){return t.CHM(e),t.oxw(2).onFileChange(r)}),t.qZA()(),t._UZ(27,"hr"),t.TgZ(28,"div",9)(29,"h4"),t._uU(30,"ELIMINAR CUENTA"),t.qZA(),t.TgZ(31,"div",20)(32,"p"),t._uU(33,"Si borras tu cuenta de JOPAKA, tus datos desaparecer\xe1n para siempre."),t.qZA(),t.TgZ(34,"button",21),t._uU(35,"Eliminar cuenta"),t.qZA(),t.TgZ(36,"div",22)(37,"div",23)(38,"div",24)(39,"div",25)(40,"h6",26),t._uU(41),t.qZA(),t._UZ(42,"button",27),t.qZA(),t.TgZ(43,"div",28)(44,"ul",29),t._UZ(45,"br"),t.TgZ(46,"li"),t._uU(47,"Todo tu registro ser\xe1 eliminado, incluidos los compartidos con otros usuarios, se eliminar\xe1n de forma permanente. "),t.qZA(),t._UZ(48,"br"),t.TgZ(49,"li"),t._uU(50,"Perder\xe1s el acceso a JOPAKA."),t.qZA()()(),t.TgZ(51,"div",30)(52,"button",31),t._uU(53,"Volver a mi cuenta"),t.qZA(),t.TgZ(54,"button",32),t._uU(55,"Continuar con la eliminaci\xf3n de mi cuenta"),t.qZA()()()()()()()()}if(2&n){const e=t.oxw(2);t.xp6(9),t.s9C("value",e.cliente.nombre),t.xp6(4),t.s9C("value",e.cliente.apellidos),t.xp6(5),t.s9C("value",e.cliente.celular),t.xp6(2),t.Q6J("ngIf",e.cliente.celular!=e.configFormGroup.value.celular&&0==e.counter),t.xp6(1),t.Q6J("ngIf",e.cliente.celular!=e.configFormGroup.value.celular),t.xp6(20),t.hij("\xbfConfirmas que quieres eliminar tu cuenta vinculada a ",e.cliente.correo,"? ")}}function M(n,o){if(1&n){const e=t.EpF();t.TgZ(0,"form",2)(1,"div",3)(2,"div",4)(3,"h4"),t._uU(4,"Configuraci\xf3n de usuario"),t.qZA(),t.TgZ(5,"button",5),t.NdJ("click",function(){return t.CHM(e),t.oxw().updateClient()}),t._uU(6," Guardar cambios "),t.qZA()(),t.TgZ(7,"p"),t._uU(8,"Cualquier cambio que hagas se aplicar\xe1 en tu cuenta JOPAKA"),t.qZA(),t._UZ(9,"br"),t.qZA(),t.YNc(10,v,3,0,"div",6),t.YNc(11,O,56,6,"div",6),t.qZA()}if(2&n){const e=t.oxw();t.Q6J("formGroup",e.configFormGroup),t.xp6(5),t.Q6J("disabled",e.cliente.nombre==e.configFormGroup.value.nombre&&e.cliente.apellidos==e.configFormGroup.value.apellidos&&e.cliente.celular==e.configFormGroup.value.celular&&""==e.configFormGroup.value.imagen||e.cliente.celular!=e.configFormGroup.value.celular&&1==e.tokenValido||e.celular!=e.configFormGroup.value.celular&&0==e.tokenValido),t.xp6(5),t.Q6J("ngIf",1==e.cliente.baneado),t.xp6(1),t.Q6J("ngIf",0==e.cliente.baneado)}}function P(n,o){1&n&&(t.TgZ(0,"div",42),t._UZ(1,"mat-spinner"),t.qZA())}let T=(()=>{class n{constructor(e,i,r,s){this.clienteService=e,this.usuarioService=i,this._formBuilder=r,this._snackBar=s,this.spinner=!1,this.snackbarMeesage="",this.segundos=0,this.espera=20,this.datosValido=!0,this.deshabilitar=!1,this.tokenValido=!0,this.counter=0,this.date=new Date,this.formSubmitted=!1,this.configFormGroup=this._formBuilder.group({}),this.tokenFormGroup=this._formBuilder.group({codigo:["",[a.kI.required,a.kI.minLength(6)]]})}ngOnInit(){this.token=localStorage.getItem("token"),this.getCliente()}getCliente(){this.clienteService.getCliente(this.token).subscribe({next:e=>this.cliente=e,complete:()=>{this.configFormGroup=this._formBuilder.group({nombre:[this.cliente.nombre],apellidos:[this.cliente.apellidos],celular:[this.cliente.celular],imagen:[""]}),console.log(this.configFormGroup.value,this.cliente)}})}onFileChange(e){e.target.files.length>0&&this.configFormGroup.patchValue({imagen:e.target.files[0]})}clearPreview(e){e.input.value=null,this.configFormGroup.patchValue({imagen:[""]})}updateClient(){this.token=localStorage.getItem("token"),console.log(this.configFormGroup.value),this.clienteService.updateCliente(this.token,this.configFormGroup.value,this.cliente).subscribe({next:e=>{console.log(e)},complete:()=>this.refresh(),error:e=>{console.error("There was an error!",e),this.snackbarMeesage="\u274c Error, celular ya registrado en otra cuenta ",this.openSnackBar()}})}deleatClient(){this.clienteService.deleteCliente(this.token).subscribe({next:e=>{console.log(e)},error:e=>{console.error("There was an error!",e),this.snackbarMeesage="\u274c Error, no pudimos eliminar tu cuenta",this.openSnackBar()}})}openSnackBar(){this._snackBar.open(this.snackbarMeesage,"\u2716",{horizontalPosition:"start",verticalPosition:"bottom",duration:7e3})}refresh(){var e=this;return(0,_.Z)(function*(){e.spinner=!0,""!=e.configFormGroup.value.imagen?(yield new Promise(i=>setTimeout(i,4e3)),window.location.reload()):yield new Promise(i=>setTimeout(i,1500)),e.getCliente(),e.spinner=!1,e.snackbarMeesage="\u2705 Se han guardado los cambios",e.openSnackBar()})()}updateTimer(){this.date.setHours(0),this.date.setMinutes(0),this.date.setSeconds(this.segundos),this.date.setMilliseconds(0);const e=this.date.getTime();this.date.setTime(e-1e3),this.segundos=this.date.getSeconds(),0===this.date.getSeconds()&&(this.deshabilitar=!1,this.stop())}stop(){clearInterval(this.timer)}start(){this.segundos=this.espera,this.segundos>0&&(this.deshabilitar=!0,this.updateTimer(),this.timer=setInterval(()=>{this.updateTimer()},1e3))}generarCodigo(e){1==this.tokenValido&&this.start(),this.celular=e,this.usuarioService.generarCodigo(e).subscribe()}verificarCodigo(e){console.log(this.celular),console.log(e),this.usuarioService.verificarCodigo(this.celular,e).subscribe({next:i=>this.veriCode=i,complete:()=>{"approved"===this.veriCode.status?(this.tokenValido=!1,this.deshabilitar=!1,this.tokenFormGroup.reset(),this.counter=0,this.snackbarMeesage="\u2705 C\xf3digo v\xe1lido ",this.openSnackBar()):(this.snackbarMeesage="\u274c C\xf3digo inv\xe1lido ",this.openSnackBar())},error:i=>{console.log("HTTP Error",i),this.snackbarMeesage="\u274c Ocurri\xf3 un error al hacer la validaci\xf3n",this.openSnackBar()}})}}return n.\u0275fac=function(e){return new(e||n)(t.Y36(u.$),t.Y36(C.i),t.Y36(a.qu),t.Y36(m.ux))},n.\u0275cmp=t.Xpm({type:n,selectors:[["app-configuracion"]],decls:2,vars:2,consts:[["action","#","autocomplete","off","class","container",3,"formGroup",4,"ngIf"],["class","spinner",4,"ngIf"],["action","#","autocomplete","off",1,"container",3,"formGroup"],[1,"header"],[1,"top"],["type","submit",1,"btn","btn-primary","btn-sm",3,"disabled","click"],["class","config",4,"ngIf"],[1,"config"],["role","alert",1,"alert","alert-danger"],[1,"user-details"],[1,"input-box"],[1,"detail"],["matInput","","type","text","formControlName","nombre","placeholder","Ingresa tu nombre",3,"value"],["matInput","","type","text","formControlName","apellidos","placeholder","Ingresa tus apellidos",3,"value"],[1,"input-token"],["matInput","","type","number","formControlName","celular","placeholder","Ingresa tu n\xfamero celular",3,"value"],["cel",""],["class","check-button",4,"ngIf"],["class","user-details",4,"ngIf"],["type","file","accept","image/png,image/jpeg",3,"change"],[1,"deleat"],["data-bs-toggle","modal","data-bs-target","#confirmDeleat",1,"btn","btn-outline-danger"],["id","confirmDeleat","tabindex","-1","aria-labelledby","confirmDeleat","aria-hidden","true",1,"modal","fade"],[1,"modal-dialog","modal-lg"],[1,"modal-content"],[1,"modal-header"],["id","exampleModalLabel",1,"modal-title"],["type","button","data-bs-dismiss","modal","aria-label","Close",1,"btn-close"],[1,"modal-body"],[1,""],[1,"modal-footer"],["type","button","data-bs-dismiss","modal",1,"btn","btn-outline-primary","btn-sm"],["type","button","data-bs-dismiss","modal","routerLink","../../../../jopaka",1,"btn","btn-primary","btn-sm"],[1,"check-button"],[3,"disabled","click"],["autocomplete","off",3,"formGroup"],[1,"token"],["matInput","","formControlName","codigo","type","number","placeholder","Ingresa el token enviado via SMS",1,"entrada"],["token",""],[1,"reenviar"],[1,"check-button","check-code"],[1,"segundos"],[1,"spinner"]],template:function(e,i){1&e&&(t.YNc(0,M,12,4,"form",0),t.YNc(1,P,2,0,"div",1)),2&e&&(t.Q6J("ngIf",i.cliente),t.xp6(1),t.Q6J("ngIf",i.spinner))},directives:[d.O5,a._Y,a.JL,a.sg,f.Nt,a.Fj,a.JJ,a.u,a.wV,p.rH,h.Ou],styles:["h4[_ngcontent-%COMP%]{font-size:23px;font-weight:600;margin-bottom:20px}p[_ngcontent-%COMP%]{margin:0;font-size:14px}.container[_ngcontent-%COMP%]{height:100%;display:flex;flex-direction:column;justify-content:space-between}.header[_ngcontent-%COMP%]{width:100%;height:auto;border-bottom:.5px solid rgb(207,207,207)}.top[_ngcontent-%COMP%]{display:flex;justify-content:space-between;align-items:center}.config[_ngcontent-%COMP%]{width:calc(100% + 32px);height:100%;border-radius:5px;padding:30px 32px 30px 0;overflow-y:auto}.config[_ngcontent-%COMP%]   h4[_ngcontent-%COMP%]{font-size:18px}.user-details[_ngcontent-%COMP%]{width:100%;padding-top:20px;padding-bottom:5px}.user-details[_ngcontent-%COMP%]   h4[_ngcontent-%COMP%]{font-size:13px;font-weight:400;color:#a5a5a5}.user-details[_ngcontent-%COMP%]   .input-box[_ngcontent-%COMP%]{display:flex;justify-content:flex-start;align-items:center;margin-bottom:15px}.user-details[_ngcontent-%COMP%]   .input-box[_ngcontent-%COMP%]   .detail[_ngcontent-%COMP%]{color:#494949;font-size:14px;font-weight:400;margin-bottom:5px;width:200px}.user-details[_ngcontent-%COMP%]   .input-box[_ngcontent-%COMP%]   input[_ngcontent-%COMP%]{height:35px;width:300px;outline:none;border-radius:5px;border:1px solid #ccc;padding-left:15px;font-size:15px;transition:all .3s ease}.user-details[_ngcontent-%COMP%]   .input-box[_ngcontent-%COMP%]   input[_ngcontent-%COMP%]:focus{border-color:#255388}[type=file][_ngcontent-%COMP%]{color:#878787}[type=file][_ngcontent-%COMP%]::-webkit-file-upload-button{background:#46acff;border:1px solid #46acff;border-radius:4px;color:#fff;cursor:pointer;font-size:13px;outline:none;padding:10px 20px;text-transform:uppercase;-webkit-transition:all .5s ease;transition:all .5s ease;margin-right:20px}[type=file][_ngcontent-%COMP%]::-webkit-file-upload-button:hover{background:#1b8eed;border:1px solid #1b8eed}.deleat[_ngcontent-%COMP%]{display:flex;justify-content:space-between;align-items:center}.deleat[_ngcontent-%COMP%]   p[_ngcontent-%COMP%]{width:300px}.spinner[_ngcontent-%COMP%]{position:fixed;top:0;left:0;width:100%;height:100vh;background:rgba(119,119,119,.492);z-index:99;display:flex;align-items:center;justify-content:center}.input-token[_ngcontent-%COMP%]{display:flex;align-items:center}.input-token[_ngcontent-%COMP%]   .reenviar[_ngcontent-%COMP%]{margin:auto;display:flex;justify-content:center;align-items:center}.input-token[_ngcontent-%COMP%]   .check-button[_ngcontent-%COMP%]   button[_ngcontent-%COMP%]{width:150px;height:30px;margin:0 15px;font-size:12px;border:none;border-radius:5px}.input-token[_ngcontent-%COMP%]   .check-code[_ngcontent-%COMP%]   button[_ngcontent-%COMP%]{background:rgba(199,255,169,.493)}.input-token[_ngcontent-%COMP%]   .check-button[_ngcontent-%COMP%]   button[_ngcontent-%COMP%]:hover{background:rgb(227,227,227)}.input-token[_ngcontent-%COMP%]   .check-code[_ngcontent-%COMP%]   button[_ngcontent-%COMP%]:hover{background:rgba(199,255,169,.982)}.input-token[_ngcontent-%COMP%]   .check-button[_ngcontent-%COMP%]   button[_ngcontent-%COMP%]:disabled{background:#f6f6f6;color:#d6d6d6}.input-token[_ngcontent-%COMP%]   .segundos[_ngcontent-%COMP%]{margin:0 10px;font-size:30px}"]}),n})();var x=c(9814);function A(n,o){1&n&&(t.TgZ(0,"div",21),t._uU(1," A\xfan no hay clientes extra "),t.qZA())}function U(n,o){if(1&n&&(t.TgZ(0,"div",22)(1,"p",23),t._uU(2,"EXTRA 1"),t.qZA(),t.TgZ(3,"h4"),t._uU(4,"Informaci\xf3n del usuario"),t.qZA(),t.TgZ(5,"div",24)(6,"div",25)(7,"div",26),t._uU(8," NOMBRE "),t.qZA(),t.TgZ(9,"div",27),t._uU(10),t.qZA()(),t.TgZ(11,"div",25)(12,"div",26),t._uU(13," APELLIDOS "),t.qZA(),t.TgZ(14,"div",27),t._uU(15),t.qZA()(),t.TgZ(16,"div",25)(17,"div",26),t._uU(18," SEXO "),t.qZA(),t.TgZ(19,"div",27),t._uU(20),t.qZA()(),t.TgZ(21,"div",25)(22,"div",26),t._uU(23," NACIMIENTO "),t.qZA(),t.TgZ(24,"div",27),t._uU(25),t.qZA()()()()),2&n){const e=t.oxw(2);t.xp6(10),t.hij(" ",e.extras.extra1.nombre," "),t.xp6(5),t.hij(" ",e.extras.extra1.apellidos," "),t.xp6(5),t.hij(" ",e.extras.extra1.sexo," "),t.xp6(5),t.hij(" ",e.extras.extra1.fecha_nacimiento," ")}}function w(n,o){if(1&n&&(t.TgZ(0,"div",22)(1,"p",23),t._uU(2,"EXTRA 2"),t.qZA(),t.TgZ(3,"h4"),t._uU(4,"Informaci\xf3n del usuario"),t.qZA(),t.TgZ(5,"div",24)(6,"div",25)(7,"div",26),t._uU(8," NOMBRE "),t.qZA(),t.TgZ(9,"div",27),t._uU(10),t.qZA()(),t.TgZ(11,"div",25)(12,"div",26),t._uU(13," APELLIDOS "),t.qZA(),t.TgZ(14,"div",27),t._uU(15),t.qZA()(),t.TgZ(16,"div",25)(17,"div",26),t._uU(18," SEXO "),t.qZA(),t.TgZ(19,"div",27),t._uU(20),t.qZA()(),t.TgZ(21,"div",25)(22,"div",26),t._uU(23," NACIMIENTO "),t.qZA(),t.TgZ(24,"div",27),t._uU(25),t.qZA()()()()),2&n){const e=t.oxw(2);t.xp6(10),t.hij(" ",e.extras.extra2.nombre," "),t.xp6(5),t.hij(" ",e.extras.extra2.apellidos," "),t.xp6(5),t.hij(" ",e.extras.extra2.sexo," "),t.xp6(5),t.hij(" ",e.extras.extra2.fecha_nacimiento," ")}}function q(n,o){if(1&n&&(t.TgZ(0,"div",18)(1,"h4"),t._uU(2,"Extras creados"),t.qZA(),t.YNc(3,A,2,0,"div",19),t.YNc(4,U,26,4,"div",20),t.YNc(5,w,26,4,"div",20),t.qZA()),2&n){const e=t.oxw();t.xp6(3),t.Q6J("ngIf",!e.extras&&""==e.extras),t.xp6(1),t.Q6J("ngIf",e.extras.extra1),t.xp6(1),t.Q6J("ngIf",e.extras.extra2)}}function k(n,o){1&n&&(t.TgZ(0,"div",28),t._UZ(1,"mat-spinner"),t.qZA())}let y=(()=>{class n{constructor(e,i,r){this.clienteService=e,this._formBuilder=i,this._snackBar=r,this.spinner=!1,this.formSubmitted=!1,this.newExtraFormGroup=this._formBuilder.group({nombre:["",[a.kI.required]],apellidos:["",a.kI.required],fecha_nacimiento:["",a.kI.required],sexo:["",a.kI.required]})}ngOnInit(){this.token=localStorage.getItem("token"),this.getExtras()}getExtras(){this.clienteService.getExtras(this.token).subscribe({next:e=>this.extras=e,error:e=>{console.error("There was an error!",e)}})}createExtra(){console.log(this.newExtraFormGroup.value),this.clienteService.postExtra(this.token,this.newExtraFormGroup.value).subscribe({next:e=>{console.log(e),this.refresh()},error:e=>{console.error("There was an error!",e),this.openSnackBarBad()}})}openSnackBar(){this._snackBar.open("\u2714 El cliente extra ha sido creado","\u2716",{horizontalPosition:"start",verticalPosition:"bottom",duration:7e3})}openSnackBarBad(){this._snackBar.open("\u274c Extra no creado, revisa que los datos no esten en otra cuenta ","\u2716",{horizontalPosition:"start",verticalPosition:"bottom",duration:7e3})}refresh(){var e=this;return(0,_.Z)(function*(){e.spinner=!0,yield new Promise(i=>setTimeout(i,1500)),e.spinner=!1,e.newExtraFormGroup.reset(),e.getExtras(),e.openSnackBar()})()}}return n.\u0275fac=function(e){return new(e||n)(t.Y36(u.$),t.Y36(a.qu),t.Y36(m.ux))},n.\u0275cmp=t.Xpm({type:n,selectors:[["app-extras"]],decls:49,vars:4,consts:[["action","#","autocomplete","off",1,"container",3,"formGroup"],[1,"header"],[1,"top"],["type","submit",1,"btn","btn-warning","btn-sm",3,"disabled","click"],[1,"extras"],[1,"config"],[1,"user-details"],[1,"input-box"],[1,"detail"],["matInput","","type","text","formControlName","nombre","placeholder","Ingresa tu nombre"],["matInput","","type","text","formControlName","apellidos","placeholder","Ingresa tus apellidos"],["matInput","","type","date","formControlName","fecha_nacimiento","required",""],["matInput","","aria-label","Select an option","formControlName","sexo","required",""],["value","Hombre"],["value","Mujer"],[1,"nota"],["class","ver-extras",4,"ngIf"],["class","spinner",4,"ngIf"],[1,"ver-extras"],["class","alert alert-secondary","role","alert",4,"ngIf"],["class","info",4,"ngIf"],["role","alert",1,"alert","alert-secondary"],[1,"info"],[1,"small"],[1,"data_container"],[1,"data"],[1,"campo"],[1,"detalle"],[1,"spinner"]],template:function(e,i){1&e&&(t.TgZ(0,"form",0)(1,"div",1)(2,"div",2)(3,"h4"),t._uU(4,"Nuevo cliente extra"),t.qZA(),t.TgZ(5,"button",3),t.NdJ("click",function(){return i.createExtra()}),t._uU(6," Crear Extra "),t.qZA()(),t.TgZ(7,"p"),t._uU(8,"Puedes crear clientes extra por si m\xe1s de una persona desea o necesita usuar la cuenta para sus consultas "),t.TgZ(9,"b"),t._uU(10,"(m\xe1x. 2)"),t.qZA(),t._uU(11,"."),t.qZA(),t._UZ(12,"br"),t.qZA(),t.TgZ(13,"div",4)(14,"div",5)(15,"h4"),t._uU(16,"Crear cliente extra"),t.qZA(),t.TgZ(17,"div",6)(18,"h4"),t._uU(19,"DATOS"),t.qZA(),t.TgZ(20,"div",7)(21,"span",8),t._uU(22,"Nombre"),t.qZA(),t._UZ(23,"input",9),t.qZA(),t.TgZ(24,"div",7)(25,"span",8),t._uU(26,"Apellidos"),t.qZA(),t._UZ(27,"input",10),t.qZA(),t.TgZ(28,"div",7)(29,"span",8),t._uU(30,"Fecha de nacimiento"),t.qZA(),t._UZ(31,"input",11),t.qZA(),t.TgZ(32,"div",7)(33,"span",8),t._uU(34,"Sexo"),t.qZA(),t._UZ(35,"br")(36,"br"),t.TgZ(37,"mat-radio-group",12)(38,"mat-radio-button",13),t._uU(39,"Hombre"),t.qZA(),t.TgZ(40,"mat-radio-button",14),t._uU(41,"Mujer"),t.qZA()()()(),t.TgZ(42,"p",15),t._uU(43," *NOTA: Una vez creado el extra, este "),t.TgZ(44,"b"),t._uU(45,"NO"),t.qZA(),t._uU(46," puede ser editado o eliminado "),t.qZA()(),t.YNc(47,q,6,3,"div",16),t.qZA()(),t.YNc(48,k,2,0,"div",17)),2&e&&(t.Q6J("formGroup",i.newExtraFormGroup),t.xp6(5),t.Q6J("disabled",i.newExtraFormGroup.invalid||i.extras.extra1&&i.extras.extra2),t.xp6(42),t.Q6J("ngIf",null!=i.extras),t.xp6(1),t.Q6J("ngIf",i.spinner))},directives:[a._Y,a.JL,a.sg,f.Nt,a.Fj,a.JJ,a.u,a.Q7,x.VQ,x.U0,d.O5,h.Ou],styles:["h4[_ngcontent-%COMP%]{font-size:23px;font-weight:600;margin-bottom:20px}p[_ngcontent-%COMP%]{font-size:14px}.container[_ngcontent-%COMP%]{height:100%;display:flex;flex-direction:column;justify-content:space-between}.header[_ngcontent-%COMP%]{width:100%;height:auto;border-bottom:.5px solid rgb(207,207,207)}.top[_ngcontent-%COMP%]{display:flex;justify-content:space-between;align-items:center}.extras[_ngcontent-%COMP%]{width:100%;height:100%;padding:20px 0;overflow-y:auto;display:flex;justify-content:space-between}.extras[_ngcontent-%COMP%]   .nota[_ngcontent-%COMP%]{margin-top:20px;color:red;font-weight:300;font-size:13px}.extras[_ngcontent-%COMP%]   .nota[_ngcontent-%COMP%]   b[_ngcontent-%COMP%]{font-weight:500}.extras[_ngcontent-%COMP%]   h4[_ngcontent-%COMP%]{font-size:18px}.extras[_ngcontent-%COMP%]   .config[_ngcontent-%COMP%]{width:100%;height:100%;padding:30px 0;border-right:.5px dashed rgb(207,207,207);overflow-y:auto}.extras[_ngcontent-%COMP%]   .user-details[_ngcontent-%COMP%]{width:100%;padding-top:20px;padding-bottom:5px}.user-details[_ngcontent-%COMP%]   h4[_ngcontent-%COMP%]{font-size:13px;font-weight:400;color:#a5a5a5}.user-details[_ngcontent-%COMP%]   .input-box[_ngcontent-%COMP%]{display:flex;justify-content:flex-start;align-items:center;margin-bottom:15px}.user-details[_ngcontent-%COMP%]   .input-box[_ngcontent-%COMP%]   .detail[_ngcontent-%COMP%]{color:#494949;font-size:14px;font-weight:400;margin-bottom:5px;width:180px}.user-details[_ngcontent-%COMP%]   .input-box[_ngcontent-%COMP%]   input[_ngcontent-%COMP%]{height:35px;width:300px;outline:none;border-radius:5px;border:1px solid #ccc;padding-left:15px;font-size:15px;transition:all .3s ease}.user-details[_ngcontent-%COMP%]   .input-box[_ngcontent-%COMP%]   input[_ngcontent-%COMP%]:focus, .user-details[_ngcontent-%COMP%]   .input-box[_ngcontent-%COMP%]   input[_ngcontent-%COMP%]:valid{border-color:#255388}.gender-details[_ngcontent-%COMP%]   .gender-title[_ngcontent-%COMP%]{font-size:20px;font-weight:500}.mat-radio-button[_ngcontent-%COMP%] ~ .mat-radio-button[_ngcontent-%COMP%]{margin-left:16px}.extras[_ngcontent-%COMP%]   .ver-extras[_ngcontent-%COMP%]{width:100%;height:100%;padding:30px;overflow-y:auto}.ver-extras[_ngcontent-%COMP%]   .info[_ngcontent-%COMP%]{width:100%;height:auto;border:.5px solid rgb(207,207,207);margin-bottom:20px;border-radius:5px;padding:20px 30px}.info[_ngcontent-%COMP%]   .small[_ngcontent-%COMP%]{font-size:12px;color:#a5a5a5}.info[_ngcontent-%COMP%]   h4[_ngcontent-%COMP%]{font-size:18px;color:#006dc0}.info[_ngcontent-%COMP%]   .data_container[_ngcontent-%COMP%]{width:calc(100% + 15px);max-height:230px;overflow-y:auto;padding-right:15px}.info[_ngcontent-%COMP%]   .data_container[_ngcontent-%COMP%]   .data[_ngcontent-%COMP%]{display:flex;justify-content:space-between;align-items:center;height:40px;border-bottom:.5px solid #ccc}.data[_ngcontent-%COMP%]   .campo[_ngcontent-%COMP%]{font-size:14px;color:#787878;width:40%}.data[_ngcontent-%COMP%]   .detalle[_ngcontent-%COMP%]{font-size:15px;color:#404040;width:100%;font-weight:400}.spinner[_ngcontent-%COMP%]{position:fixed;top:0;left:0;width:100%;height:100vh;background:rgba(119,119,119,.492);z-index:99;display:flex;align-items:center;justify-content:center}"]}),n})();var l=c(4999);function I(n,o){1&n&&(t.TgZ(0,"div",7),t._uU(1," A\xfan no hay pagos por mostrar! "),t.qZA())}function N(n,o){1&n&&(t.TgZ(0,"th",20),t._uU(1," No. "),t.qZA())}function E(n,o){if(1&n&&(t.TgZ(0,"td",21),t._uU(1),t.qZA()),2&n){const e=o.index;t.xp6(1),t.hij(" ",e+1," ")}}function S(n,o){1&n&&(t.TgZ(0,"th",20),t._uU(1," Cliente "),t.qZA())}function F(n,o){if(1&n&&(t.TgZ(0,"td",21),t._uU(1),t.qZA()),2&n){const e=o.$implicit;t.xp6(1),t.hij(" ",e.nombreCliente," ")}}function D(n,o){1&n&&(t.TgZ(0,"th",20),t._uU(1," Nutri\xf3logo "),t.qZA())}function j(n,o){if(1&n&&(t.TgZ(0,"td",21),t._uU(1),t.qZA()),2&n){const e=o.$implicit;t.xp6(1),t.hij(" ",e.nombreNutriologo," ")}}function z(n,o){1&n&&(t.TgZ(0,"th",20),t._uU(1," Costo del servicio "),t.qZA())}function J(n,o){if(1&n&&(t.TgZ(0,"td",21),t._uU(1),t.qZA()),2&n){const e=o.$implicit;t.xp6(1),t.hij(" $ ",e.precio_servicio," ")}}function H(n,o){1&n&&(t.TgZ(0,"th",20),t._uU(1," Fecha de pago "),t.qZA())}function Y(n,o){if(1&n&&(t.TgZ(0,"td",21),t._uU(1),t.qZA()),2&n){const e=o.$implicit;t.xp6(1),t.hij(" ",e.fecha_pago," ")}}function G(n,o){1&n&&(t.TgZ(0,"th",20),t._uU(1," Constancia "),t.qZA())}function B(n,o){if(1&n){const e=t.EpF();t.TgZ(0,"td",21)(1,"button",22),t.NdJ("click",function(){const s=t.CHM(e).index;return t.oxw(3).getPago(s)}),t._UZ(2,"i",23),t.qZA()()}}function Q(n,o){1&n&&t._UZ(0,"tr",24)}function L(n,o){1&n&&t._UZ(0,"tr",25)}function R(n,o){if(1&n&&(t.TgZ(0,"section",8)(1,"table",9),t.ynx(2,10),t.YNc(3,N,2,0,"th",11),t.YNc(4,E,2,1,"td",12),t.BQk(),t.ynx(5,13),t.YNc(6,S,2,0,"th",11),t.YNc(7,F,2,1,"td",12),t.BQk(),t.ynx(8,14),t.YNc(9,D,2,0,"th",11),t.YNc(10,j,2,1,"td",12),t.BQk(),t.ynx(11,15),t.YNc(12,z,2,0,"th",11),t.YNc(13,J,2,1,"td",12),t.BQk(),t.ynx(14,16),t.YNc(15,H,2,0,"th",11),t.YNc(16,Y,2,1,"td",12),t.BQk(),t.ynx(17,17),t.YNc(18,G,2,0,"th",11),t.YNc(19,B,3,0,"td",12),t.BQk(),t.YNc(20,Q,1,0,"tr",18),t.YNc(21,L,1,0,"tr",19),t.qZA()()),2&n){const e=t.oxw(2);t.xp6(1),t.Q6J("dataSource",e.pagos),t.xp6(19),t.Q6J("matHeaderRowDef",e.displayedColumns)("matHeaderRowDefSticky",!0),t.xp6(1),t.Q6J("matRowDefColumns",e.displayedColumns)}}function V(n,o){1&n&&(t.TgZ(0,"div",7),t._uU(1," A\xfan no hay dietas por mostrar! "),t.qZA())}function X(n,o){if(1&n){const e=t.EpF();t.TgZ(0,"div",28)(1,"button",22),t.NdJ("click",function(){const s=t.CHM(e).index;return t.oxw(3).getDieta(s)}),t._UZ(2,"i",29),t.qZA(),t.TgZ(3,"p"),t._uU(4),t.qZA()()}if(2&n){const e=o.index;t.xp6(4),t.hij("Dieta_",e+1," ")}}function $(n,o){if(1&n&&(t.TgZ(0,"div",26),t.YNc(1,X,5,1,"div",27),t.qZA()),2&n){const e=t.oxw(2);t.xp6(1),t.Q6J("ngForOf",e.clienteData.historial)}}function K(n,o){if(1&n&&(t.TgZ(0,"div",1)(1,"div",2)(2,"h4"),t._uU(3,"Historial"),t.qZA(),t.TgZ(4,"p"),t._uU(5,"Visualiza tu historial de pagos y tu historial de dietas"),t.qZA(),t._UZ(6,"br"),t.qZA(),t.TgZ(7,"div",3)(8,"h4"),t._uU(9,"Historial de pagos"),t.qZA(),t.YNc(10,I,2,0,"div",4),t.YNc(11,R,22,4,"section",5),t._UZ(12,"br")(13,"br")(14,"hr"),t.TgZ(15,"h4"),t._uU(16,"Historial de dietas"),t.qZA(),t.YNc(17,V,2,0,"div",4),t.YNc(18,$,2,1,"div",6),t._UZ(19,"br")(20,"br"),t.qZA()()),2&n){const e=t.oxw();t.xp6(10),t.Q6J("ngIf",0==e.pagos.length),t.xp6(1),t.Q6J("ngIf",e.pagos.length>0),t.xp6(6),t.Q6J("ngIf",0==e.clienteData.historial.length),t.xp6(1),t.Q6J("ngIf",e.clienteData.historial.length>0)}}let W=(()=>{class n{constructor(e){this.clienteService=e,this.pagos=[],this.displayedColumns=["position","nombreCliente","nombreNutriologo","precio_servicio","fecha_pago","constancia"]}ngOnInit(){this.token=localStorage.getItem("token"),this.clienteService.getPagos(this.token).subscribe({next:e=>this.pagos=e}),this.clienteService.getCliente(this.token).subscribe({next:e=>this.clienteData=e})}getPago(e){this.clienteService.getPago(this.token,e).subscribe(i=>{console.log(i);let r=new Blob([i],{type:"application/pdf"});var s=URL.createObjectURL(r);window.open(s)})}getDieta(e){this.clienteService.getDieta(this.token,e,this.clienteData._id).subscribe(i=>{console.log(i);let r=new Blob([i],{type:"application/pdf"});var s=URL.createObjectURL(r);window.open(s)})}}return n.\u0275fac=function(e){return new(e||n)(t.Y36(u.$))},n.\u0275cmp=t.Xpm({type:n,selectors:[["app-historial"]],decls:1,vars:1,consts:[["class","container",4,"ngIf"],[1,"container"],[1,"header"],[1,"listas"],["class","alert alert-primary","role","alert",4,"ngIf"],["class","lista_container mat-elevation-z8","tabindex","0",4,"ngIf"],["class","archivoDieta",4,"ngIf"],["role","alert",1,"alert","alert-primary"],["tabindex","0",1,"lista_container","mat-elevation-z8"],["mat-table","",3,"dataSource"],["matColumnDef","position"],["mat-header-cell","",4,"matHeaderCellDef"],["mat-cell","",4,"matCellDef"],["matColumnDef","nombreCliente"],["matColumnDef","nombreNutriologo"],["matColumnDef","precio_servicio"],["matColumnDef","fecha_pago"],["matColumnDef","constancia"],["mat-header-row","",4,"matHeaderRowDef","matHeaderRowDefSticky"],["mat-row","",4,"matRowDef","matRowDefColumns"],["mat-header-cell",""],["mat-cell",""],[3,"click"],[1,"bx","bxs-file-pdf","bx-sm"],["mat-header-row",""],["mat-row",""],[1,"archivoDieta"],["class","doc",4,"ngFor","ngForOf"],[1,"doc"],[1,"bx","bxs-file-pdf","bx-lg"]],template:function(e,i){1&e&&t.YNc(0,K,21,4,"div",0),2&e&&t.Q6J("ngIf",i.clienteData&&i.pagos)},directives:[d.O5,l.BZ,l.w1,l.fO,l.ge,l.Dz,l.ev,l.as,l.XQ,l.nj,l.Gk,d.sg],styles:["h4[_ngcontent-%COMP%]{font-size:23px;font-weight:600;margin-bottom:20px}p[_ngcontent-%COMP%]{font-size:14px}.container[_ngcontent-%COMP%]{height:100%;display:flex;flex-direction:column;justify-content:space-between}.header[_ngcontent-%COMP%]{width:100%;height:auto;border-bottom:.5px solid rgb(207,207,207)}.listas[_ngcontent-%COMP%]{width:calc(100% + 32px);height:100%;border-radius:5px;padding:30px 32px 30px 0;overflow-y:auto}.listas[_ngcontent-%COMP%]   h4[_ngcontent-%COMP%]{font-size:18px}.listas[_ngcontent-%COMP%]   button[_ngcontent-%COMP%]{border:none;background:none}.listas[_ngcontent-%COMP%]   i[_ngcontent-%COMP%]{color:red}.listas[_ngcontent-%COMP%]   .lista_container[_ngcontent-%COMP%]{max-height:400px;height:auto;overflow:auto}table[_ngcontent-%COMP%]{width:100%}.archivoDieta[_ngcontent-%COMP%]{display:flex;flex-wrap:wrap;height:auto;max-height:500px;width:100%;overflow-y:auto}.archivoDieta[_ngcontent-%COMP%]   .doc[_ngcontent-%COMP%]{text-align:center;padding:15px 25px}"]}),n})();function tt(n,o){1&n&&(t.TgZ(0,"div",6),t._uU(1," Adecuado "),t.qZA())}function et(n,o){1&n&&(t.TgZ(0,"div",10),t._uU(1," BANEADO "),t.qZA())}function nt(n,o){if(1&n&&(t.TgZ(0,"div",1)(1,"p",2),t._uU(2,"CONFIGURACI\xd3N DEL USUARIO"),t.qZA(),t.TgZ(3,"h4"),t._uU(4,"Informaci\xf3n del usuario"),t.qZA(),t.TgZ(5,"p",2),t._uU(6,"Puedes editar tu nombre, apellidos, celular y foto de perfil."),t.qZA(),t._UZ(7,"br"),t.TgZ(8,"div",3)(9,"div",4)(10,"div",5),t._uU(11," NOMBRE "),t.qZA(),t.TgZ(12,"div",6),t._uU(13),t.qZA()(),t.TgZ(14,"div",4)(15,"div",5),t._uU(16," APELLIDOS "),t.qZA(),t.TgZ(17,"div",6),t._uU(18),t.qZA()(),t.TgZ(19,"div",4)(20,"div",5),t._uU(21," ESTATUS "),t.qZA(),t.YNc(22,tt,2,0,"div",7),t.YNc(23,et,2,0,"div",8),t.qZA(),t.TgZ(24,"div",4)(25,"div",5),t._uU(26," SEXO "),t.qZA(),t.TgZ(27,"div",6),t._uU(28),t.qZA()(),t.TgZ(29,"div",4)(30,"div",5),t._uU(31," NACIMIENTO "),t.qZA(),t.TgZ(32,"div",6),t._uU(33),t.ALo(34,"date"),t.qZA()(),t.TgZ(35,"div",4)(36,"div",5),t._uU(37," CELULAR "),t.qZA(),t.TgZ(38,"div",6),t._uU(39),t.qZA()(),t.TgZ(40,"div",4)(41,"div",5),t._uU(42," CORREO "),t.qZA(),t.TgZ(43,"div",6),t._uU(44),t.qZA()()(),t._UZ(45,"br")(46,"br"),t.TgZ(47,"a",9),t._uU(48," Ver m\xe1s en Configuraci\xf3n de datos "),t.qZA()()),2&n){const e=t.oxw();t.xp6(13),t.hij(" ",e.clienteData.nombre," "),t.xp6(5),t.hij(" ",e.clienteData.apellidos," "),t.xp6(4),t.Q6J("ngIf",0==e.clienteData.baneado),t.xp6(1),t.Q6J("ngIf",1==e.clienteData.baneado),t.xp6(5),t.hij(" ",e.clienteData.sexo," "),t.xp6(5),t.hij(" ",t.lcZ(34,8,e.clienteData.fecha_nacimiento)," "),t.xp6(6),t.hij(" ",e.clienteData.celular," "),t.xp6(5),t.hij(" ",e.clienteData.correo," ")}}let ot=(()=>{class n{constructor(e){this.clienteService=e}ngOnInit(){this.token=localStorage.getItem("token"),this.clienteService.getCliente(this.token).subscribe({next:e=>this.clienteData=e})}}return n.\u0275fac=function(e){return new(e||n)(t.Y36(u.$))},n.\u0275cmp=t.Xpm({type:n,selectors:[["app-info-general"]],decls:6,vars:1,consts:[["class","info",4,"ngIf"],[1,"info"],[1,"small"],[1,"data_container"],[1,"data"],[1,"campo"],[1,"detalle"],["class","detalle",4,"ngIf"],["class","detalle","style","color: red;",4,"ngIf"],["routerLink","../settings"],[1,"detalle",2,"color","red"]],template:function(e,i){1&e&&(t.TgZ(0,"h4"),t._uU(1,"Informaci\xf3n general"),t.qZA(),t.TgZ(2,"p"),t._uU(3,"Un lugar para administrar y configurar tu informaci\xf3n."),t.qZA(),t._UZ(4,"br"),t.YNc(5,nt,49,10,"div",0)),2&e&&(t.xp6(5),t.Q6J("ngIf",i.clienteData))},directives:[d.O5,p.yS],pipes:[d.uU],styles:["h4[_ngcontent-%COMP%]{font-size:23px;font-weight:600;margin-bottom:20px}p[_ngcontent-%COMP%]{font-size:14px}.info[_ngcontent-%COMP%]{width:550px;height:auto;border:.5px solid rgb(207,207,207);border-radius:5px;padding:20px 30px;position:relative}.info[_ngcontent-%COMP%]   .small[_ngcontent-%COMP%]{font-size:12px;color:#a5a5a5}.info[_ngcontent-%COMP%]   h4[_ngcontent-%COMP%]{font-size:18px}.info[_ngcontent-%COMP%]   .data_container[_ngcontent-%COMP%]{width:calc(100% + 15px);max-height:230px;overflow-y:auto;padding-right:15px}.data[_ngcontent-%COMP%]{display:flex;justify-content:space-between;align-items:center;height:40px;border-bottom:.5px solid #ccc}.data[_ngcontent-%COMP%]   .campo[_ngcontent-%COMP%]{font-size:14px;color:#787878;width:40%}.data[_ngcontent-%COMP%]   .detalle[_ngcontent-%COMP%]{font-size:15px;color:#404040;width:100%;font-weight:400}.info[_ngcontent-%COMP%]   a[_ngcontent-%COMP%]{position:absolute;text-decoration:none;top:calc(100% - 40px);left:calc(100% - 300px);font-weight:600;font-size:15px}"]}),n})();function it(n,o){if(1&n&&(t.TgZ(0,"div",9)(1,"div",10)(2,"div",11),t._UZ(3,"img",12),t.qZA(),t.TgZ(4,"div",13)(5,"div",14)(6,"p"),t._uU(7),t.qZA()(),t.TgZ(8,"div",15)(9,"p"),t._uU(10),t.qZA()()(),t.TgZ(11,"div",16)(12,"ul",17)(13,"li")(14,"a",18),t._uU(15,"Informaci\xf3n general"),t.qZA()(),t.TgZ(16,"li")(17,"a",19),t._uU(18,"Configuraci\xf3n de datos"),t.qZA()(),t.TgZ(19,"li")(20,"a",20),t._uU(21,"Historial"),t.qZA()(),t.TgZ(22,"li")(23,"a",21),t._uU(24,"Extras"),t.qZA()()()()(),t.TgZ(25,"div",22),t._UZ(26,"router-outlet"),t.qZA()()),2&n){const e=t.oxw();t.xp6(3),t.s9C("src",e.clienteData.imagen,t.LSH),t.xp6(4),t.AsE(" ",e.clienteData.nombre," ",e.clienteData.apellidos," "),t.xp6(3),t.hij(" ",e.clienteData.correo," ")}}const at=[{path:"",component:(()=>{class n{constructor(e){this.clienteService=e}ngOnInit(){this.token=localStorage.getItem("token"),this.clienteService.getCliente(this.token).subscribe({next:e=>this.clienteData=e})}}return n.\u0275fac=function(e){return new(e||n)(t.Y36(u.$))},n.\u0275cmp=t.Xpm({type:n,selectors:[["app-sidebar"]],decls:13,vars:1,consts:[[1,"top"],[1,"navbar"],[1,"back"],["routerLink","../"],[1,"bx","bx-left-arrow-circle"],[1,"titulo"],[1,"logo"],["src","assets/img/logo.png","alt",""],["class","content",4,"ngIf"],[1,"content"],[1,"sidebar"],[1,"imagenUsuario"],["alt","",3,"src"],[1,"perfil"],[1,"nombre"],[1,"correo"],[1,"menu"],[1,"links"],["routerLink","overview"],["routerLink","settings"],["routerLink","record"],["routerLink","extras"],[1,"info"]],template:function(e,i){1&e&&(t.TgZ(0,"body")(1,"div",0)(2,"div",1)(3,"div",2)(4,"a",3),t._UZ(5,"i",4),t._uU(6," Regresar "),t.qZA()(),t.TgZ(7,"div",5),t._uU(8," CONFIGURACI\xd3N "),t.qZA(),t.TgZ(9,"div",6)(10,"a",3),t._UZ(11,"img",7),t.qZA()()()(),t.YNc(12,it,27,4,"div",8),t.qZA()),2&e&&(t.xp6(12),t.Q6J("ngIf",i.clienteData))},directives:[p.yS,d.O5,p.lC],styles:['@import"https://fonts.googleapis.com/css2?family=Poppins:wght@200;300;400;500;600;700&display=swap";*[_ngcontent-%COMP%]{margin:0;padding:0;box-sizing:border-box;font-family:Poppins,sans-serif}body[_ngcontent-%COMP%]{min-height:100vh}.material-icons[_ngcontent-%COMP%]{font-family:Material Icons!important}.top[_ngcontent-%COMP%]{top:0;left:0;width:100%;height:100%;height:70px;background:#ffffff;box-shadow:0 1px 5px #0003;z-index:99}.top[_ngcontent-%COMP%]   .navbar[_ngcontent-%COMP%]{height:100%;max-width:1250px;width:100%;display:flex;align-items:center;justify-content:space-between;margin:auto;padding:0 50px}.top[_ngcontent-%COMP%]   .navbar[_ngcontent-%COMP%]   a[_ngcontent-%COMP%]{text-decoration:none;white-space:nowrap;color:#00367d;font-size:25px;font-weight:400;display:flex;align-items:center}.top[_ngcontent-%COMP%]   .navbar[_ngcontent-%COMP%]   a[_ngcontent-%COMP%]   i[_ngcontent-%COMP%]{margin:0 10px;font-size:25px}.top[_ngcontent-%COMP%]   .navbar[_ngcontent-%COMP%]   a[_ngcontent-%COMP%]:hover{color:#005acf;transition:.2s}.top[_ngcontent-%COMP%]   .navbar[_ngcontent-%COMP%]   .logo[_ngcontent-%COMP%]   img[_ngcontent-%COMP%]{max-height:35px;width:auto}.top[_ngcontent-%COMP%]   .navbar[_ngcontent-%COMP%]   .titulo[_ngcontent-%COMP%]{font-size:25px;font-weight:500;color:#494949}body[_ngcontent-%COMP%]   .content[_ngcontent-%COMP%]{margin-top:10px;display:flex;width:100%;height:88vh;justify-content:space-between}.content[_ngcontent-%COMP%]   .sidebar[_ngcontent-%COMP%]{width:500px;padding:20px 0;border-right:1px solid rgb(183,183,183)}.perfil[_ngcontent-%COMP%]{margin-bottom:50px}.sidebar[_ngcontent-%COMP%]   .imagenUsuario[_ngcontent-%COMP%]{width:150px;height:150px;overflow:hidden;margin:40px auto;position:relative;box-shadow:10px 10px 20px #ccc;border-radius:50%}.imagenUsuario[_ngcontent-%COMP%]   img[_ngcontent-%COMP%]{position:absolute;left:-100%;right:-100%;margin:auto;height:150px}.nombre[_ngcontent-%COMP%]{font-weight:600;font-size:20px;text-align:center}.correo[_ngcontent-%COMP%]{font-size:15px;text-align:center}.menu[_ngcontent-%COMP%]   .links[_ngcontent-%COMP%]{line-height:50px;height:100%}.menu[_ngcontent-%COMP%]   .links[_ngcontent-%COMP%]   li[_ngcontent-%COMP%]{align-items:center;list-style:none;padding-left:15px;border-top:.2px solid #ccc;border-bottom:.2px solid #ccc}.menu[_ngcontent-%COMP%]   li[_ngcontent-%COMP%]   a[_ngcontent-%COMP%]{height:100%;text-decoration:none;white-space:nowrap;color:#3c3c3c;font-size:17px;font-weight:400}.menu[_ngcontent-%COMP%]   li[_ngcontent-%COMP%]:hover{color:#3c3c3c;border-left:5px solid rgb(60,60,60);background:rgb(237,237,237)}.content[_ngcontent-%COMP%]   .info[_ngcontent-%COMP%]{width:100%;height:100%;padding:40px 20px 0 60px;overflow-y:auto}']}),n})(),children:[{path:"extras",component:y},{path:"overview",component:ot},{path:"record",component:W},{path:"settings",component:T},{path:"**",redirectTo:"overview"}]}];let rt=(()=>{class n{}return n.\u0275fac=function(e){return new(e||n)},n.\u0275mod=t.oAB({type:n}),n.\u0275inj=t.cJS({imports:[[p.Bz.forChild(at)],p.Bz]}),n})();var ct=c(5090);let st=(()=>{class n{}return n.\u0275fac=function(e){return new(e||n)},n.\u0275mod=t.oAB({type:n}),n.\u0275inj=t.cJS({imports:[[d.ez,rt,ct.q,a.UX]]}),n})()}}]);