"use strict";(self.webpackChunkjopaka=self.webpackChunkjopaka||[]).push([[782],{782:(k,g,r)=>{r.r(g),r.d(g,{CuentaAdminModule:()=>U});var s=r(9808),i=r(3075),d=r(1083),p=r(5861),n=r(5e3),l=r(6088),u=r(7261),m=r(7531),f=r(773);function C(e,a){if(1&e){const t=n.EpF();n.TgZ(0,"form",2)(1,"div",3)(2,"div",4)(3,"h4"),n._uU(4,"Configuraci\xf3n de usuario"),n.qZA(),n.TgZ(5,"button",5),n.NdJ("click",function(){return n.CHM(t),n.oxw().updateAdmin()}),n._uU(6," Guardar cambios "),n.qZA()(),n.TgZ(7,"p"),n._uU(8,"Cualquier cambio que hagas se aplicar\xe1 en tu cuenta JOPAKA"),n.qZA(),n._UZ(9,"br"),n.qZA(),n.TgZ(10,"div",6)(11,"h4"),n._uU(12,"Configuraci\xf3n de perf\xedl"),n.qZA(),n.TgZ(13,"div",7)(14,"h4"),n._uU(15,"DATOS GENERALES"),n.qZA(),n.TgZ(16,"div",8)(17,"span",9),n._uU(18,"Nombre"),n.qZA(),n._UZ(19,"input",10),n.qZA(),n.TgZ(20,"div",8)(21,"span",9),n._uU(22,"Apellidos"),n.qZA(),n._UZ(23,"input",11),n.qZA(),n.TgZ(24,"div",8)(25,"span",9),n._uU(26,"N\xfamero celular"),n.qZA(),n._UZ(27,"input",12),n.qZA()(),n._UZ(28,"hr"),n.TgZ(29,"div",7)(30,"h4"),n._uU(31,"FOTO DE PERFIL"),n.qZA(),n.TgZ(32,"input",13),n.NdJ("change",function(c){return n.CHM(t),n.oxw().onFileChange(c)}),n.qZA()()()()}if(2&e){const t=n.oxw();n.Q6J("formGroup",t.configFormGroup),n.xp6(5),n.Q6J("disabled",t.adminData.nombre==t.configFormGroup.value.nombre&&t.adminData.apellidos==t.configFormGroup.value.apellidos&&t.adminData.celular==t.configFormGroup.value.celular&&""==t.configFormGroup.value.imagen),n.xp6(14),n.MGl("value"," ",t.adminData.nombre," "),n.xp6(4),n.MGl("value"," ",t.adminData.apellidos," "),n.xp6(4),n.MGl("value"," ",t.adminData.celular," ")}}function x(e,a){1&e&&(n.TgZ(0,"div",14),n._UZ(1,"mat-spinner"),n.qZA())}let b=(()=>{class e{constructor(t,o,c,_){this.administradorService=t,this._formBuilder=o,this.cd=c,this._snackBar=_,this.spinner=!1,this.formSubmitted=!1,this.configFormGroup=this._formBuilder.group({})}ngOnInit(){this.token=localStorage.getItem("token"),this.administradorService.getAdmin(this.token).subscribe({next:t=>this.adminData=t,complete:()=>{this.configFormGroup=this._formBuilder.group({nombre:[this.adminData.nombre],apellidos:[this.adminData.apellidos],celular:[this.adminData.celular],imagen:[""]}),console.log(this.configFormGroup.value,this.adminData)}}),"1"==localStorage.getItem("succes")&&this.openSnackBar()}onFileChange(t){t.target.files.length>0&&this.configFormGroup.patchValue({imagen:t.target.files[0]})}clearPreview(t){t.input.value=null,this.configFormGroup.patchValue({imagen:[""]})}updateAdmin(){var t=this;return(0,p.Z)(function*(){t.token=localStorage.getItem("token"),console.log(t.configFormGroup.value),t.administradorService.updateAdmin(t.token,t.configFormGroup.value,t.adminData).subscribe({next:o=>{console.log(o),t.refresh()},error:o=>{console.error("There was an error!",o),t.openSnackBarBad()}})})()}openSnackBarBad(){this._snackBar.open("\u274c Ocurri\xf3 un error, gmail y/o celular ya registrados ","\u2716",{horizontalPosition:"start",verticalPosition:"bottom",duration:7e3})}openSnackBar(){this._snackBar.open("\u2705 Se han guardado los cambios","\u2716",{horizontalPosition:"start",verticalPosition:"bottom",duration:7e3}),localStorage.removeItem("succes")}refresh(){var t=this;return(0,p.Z)(function*(){t.spinner=!0,""!=t.configFormGroup.value.imagen?yield new Promise(o=>setTimeout(o,4e3)):yield new Promise(o=>setTimeout(o,1500)),t.spinner=!1,localStorage.setItem("succes","1"),window.location.reload()})()}}return e.\u0275fac=function(t){return new(t||e)(n.Y36(l.p),n.Y36(i.qu),n.Y36(n.sBO),n.Y36(u.ux))},e.\u0275cmp=n.Xpm({type:e,selectors:[["app-configuracion"]],decls:2,vars:2,consts:[["action","#","autocomplete","off","class","container",3,"formGroup",4,"ngIf"],["class","spinner",4,"ngIf"],["action","#","autocomplete","off",1,"container",3,"formGroup"],[1,"header"],[1,"top"],["type","submit",1,"btn","btn-primary","btn-sm",3,"disabled","click"],[1,"config"],[1,"user-details"],[1,"input-box"],[1,"detail"],["matInput","","type","text","formControlName","nombre","placeholder","Ingresa tu nombre",3,"value"],["matInput","","type","text","formControlName","apellidos","placeholder","Ingresa tus apellidos",3,"value"],["matInput","","type","number","formControlName","celular","placeholder","Ingresa tu n\xfamero celular",3,"value"],["type","file","accept","image/x-png,image/gif,image/jpeg",3,"change"],[1,"spinner"]],template:function(t,o){1&t&&(n.YNc(0,C,33,5,"form",0),n.YNc(1,x,2,0,"div",1)),2&t&&(n.Q6J("ngIf",o.adminData),n.xp6(1),n.Q6J("ngIf",o.spinner))},directives:[s.O5,i._Y,i.JL,i.sg,m.Nt,i.Fj,i.JJ,i.u,i.wV,f.Ou],styles:["h4[_ngcontent-%COMP%]{font-size:23px;font-weight:600;margin-bottom:20px}p[_ngcontent-%COMP%]{margin:0;font-size:14px}.container[_ngcontent-%COMP%]{height:100%;display:flex;flex-direction:column;justify-content:space-between}.header[_ngcontent-%COMP%]{width:100%;height:auto;border-bottom:.5px solid rgb(207,207,207)}.top[_ngcontent-%COMP%]{display:flex;justify-content:space-between;align-items:center}.config[_ngcontent-%COMP%]{width:calc(100% + 32px);height:100%;border-radius:5px;padding:30px 32px 30px 0;overflow-y:auto}.config[_ngcontent-%COMP%]   .alert-danger[_ngcontent-%COMP%]   a[_ngcontent-%COMP%]{margin:0 10px;text-decoration:none;font-weight:600;color:brown}.config[_ngcontent-%COMP%]   h4[_ngcontent-%COMP%]{font-size:18px}.user-details[_ngcontent-%COMP%]{width:100%;padding-top:20px;padding-bottom:5px}.user-details[_ngcontent-%COMP%]   h4[_ngcontent-%COMP%]{font-size:13px;font-weight:400;color:#a5a5a5}.user-details[_ngcontent-%COMP%]   .input-box[_ngcontent-%COMP%]{display:flex;justify-content:flex-start;align-items:center;margin-bottom:15px}.user-details[_ngcontent-%COMP%]   .input-box[_ngcontent-%COMP%]   .detail[_ngcontent-%COMP%]{color:#494949;font-size:14px;font-weight:400;margin-bottom:5px;width:200px}.user-details[_ngcontent-%COMP%]   .input-box[_ngcontent-%COMP%]   input[_ngcontent-%COMP%]{height:35px;width:300px;outline:none;border-radius:5px;border:1px solid #ccc;padding-left:15px;font-size:15px;transition:all .3s ease}.user-details[_ngcontent-%COMP%]   .input-box[_ngcontent-%COMP%]   input[_ngcontent-%COMP%]:focus{border-color:#255388}.mat-radio-button[_ngcontent-%COMP%] ~ .mat-radio-button[_ngcontent-%COMP%]{margin-left:16px}[type=file][_ngcontent-%COMP%]{color:#878787}[type=file][_ngcontent-%COMP%]::-webkit-file-upload-button{background:#46acff;border:1px solid #46acff;border-radius:4px;color:#fff;cursor:pointer;font-size:13px;outline:none;padding:10px 20px;text-transform:uppercase;-webkit-transition:all .5s ease;transition:all .5s ease;margin-right:20px}[type=file][_ngcontent-%COMP%]::-webkit-file-upload-button:hover{background:#1b8eed;border:1px solid #1b8eed}.deleat[_ngcontent-%COMP%]{display:flex;justify-content:space-between;align-items:center}.deleat[_ngcontent-%COMP%]   p[_ngcontent-%COMP%]{width:300px}.spinner[_ngcontent-%COMP%]{position:fixed;top:0;left:0;width:100%;height:100vh;background:rgba(119,119,119,.492);z-index:99;display:flex;align-items:center;justify-content:center}.input-token[_ngcontent-%COMP%]{display:flex;align-items:center}.input-token[_ngcontent-%COMP%]   .reenviar[_ngcontent-%COMP%]{margin:auto;display:flex;justify-content:center;align-items:center}.input-token[_ngcontent-%COMP%]   .check-button[_ngcontent-%COMP%]   button[_ngcontent-%COMP%]{width:150px;height:30px;margin:0 15px;font-size:12px;border:none;border-radius:5px}.input-token[_ngcontent-%COMP%]   .check-code[_ngcontent-%COMP%]   button[_ngcontent-%COMP%]{background:rgba(199,255,169,.493)}.input-token[_ngcontent-%COMP%]   .check-button[_ngcontent-%COMP%]   button[_ngcontent-%COMP%]:hover{background:rgb(227,227,227)}.input-token[_ngcontent-%COMP%]   .check-code[_ngcontent-%COMP%]   button[_ngcontent-%COMP%]:hover{background:rgba(199,255,169,.982)}.input-token[_ngcontent-%COMP%]   .check-button[_ngcontent-%COMP%]   button[_ngcontent-%COMP%]:disabled{background:#f6f6f6;color:#d6d6d6}.input-token[_ngcontent-%COMP%]   .segundos[_ngcontent-%COMP%]{margin:0 10px;font-size:30px}"]}),e})();function O(e,a){if(1&e&&(n.TgZ(0,"div",1)(1,"p",2),n._uU(2,"CONFIGURACI\xd3N DEL USUARIO"),n.qZA(),n.TgZ(3,"h4"),n._uU(4,"Informaci\xf3n del usuario"),n.qZA(),n.TgZ(5,"p",2),n._uU(6,"Puedes editar tu nombre, apellidos, celular y foto de perfil."),n.qZA(),n._UZ(7,"br"),n.TgZ(8,"div",3)(9,"div",4),n._uU(10," NOMBRE "),n.qZA(),n.TgZ(11,"div",5),n._uU(12),n.qZA()(),n.TgZ(13,"div",3)(14,"div",4),n._uU(15," APELLIDOS "),n.qZA(),n.TgZ(16,"div",5),n._uU(17),n.qZA()(),n.TgZ(18,"div",3)(19,"div",4),n._uU(20," SEXO "),n.qZA(),n.TgZ(21,"div",5),n._uU(22),n.qZA()(),n.TgZ(23,"div",3)(24,"div",4),n._uU(25," CELULAR "),n.qZA(),n.TgZ(26,"div",5),n._uU(27),n.qZA()(),n.TgZ(28,"div",3)(29,"div",4),n._uU(30," CORREO "),n.qZA(),n.TgZ(31,"div",5),n._uU(32),n.qZA()(),n._UZ(33,"br")(34,"br"),n.TgZ(35,"a",6),n._uU(36," Ver m\xe1s en Configuraci\xf3n de datos "),n.qZA()()),2&e){const t=n.oxw();n.xp6(12),n.hij(" ",t.adminData.nombre," "),n.xp6(5),n.hij(" ",t.adminData.apellidos," "),n.xp6(5),n.hij(" ",t.adminData.sexo," "),n.xp6(5),n.hij(" ",t.adminData.celular," "),n.xp6(5),n.hij(" ",t.adminData.correo," ")}}let P=(()=>{class e{constructor(t){this.administradorService=t}ngOnInit(){this.token=localStorage.getItem("token"),this.administradorService.getAdmin(this.token).subscribe({next:t=>this.adminData=t})}}return e.\u0275fac=function(t){return new(t||e)(n.Y36(l.p))},e.\u0275cmp=n.Xpm({type:e,selectors:[["app-info-general"]],decls:6,vars:1,consts:[["class","info",4,"ngIf"],[1,"info"],[1,"small"],[1,"data"],[1,"campo"],[1,"detalle"],["routerLink","../settings"]],template:function(t,o){1&t&&(n.TgZ(0,"h4"),n._uU(1,"Informaci\xf3n general"),n.qZA(),n.TgZ(2,"p"),n._uU(3,"Un lugar para administrar y configurar tu informaci\xf3n."),n.qZA(),n._UZ(4,"br"),n.YNc(5,O,37,5,"div",0)),2&t&&(n.xp6(5),n.Q6J("ngIf",o.adminData))},directives:[s.O5,d.yS],styles:["h4[_ngcontent-%COMP%]{font-size:23px;font-weight:600;margin-bottom:20px}p[_ngcontent-%COMP%]{font-size:14px}.info[_ngcontent-%COMP%]{width:550px;height:auto;border:.5px solid rgb(207,207,207);border-radius:5px;padding:20px 30px;position:relative}.info[_ngcontent-%COMP%]   .small[_ngcontent-%COMP%]{font-size:12px;color:#a5a5a5}.info[_ngcontent-%COMP%]   h4[_ngcontent-%COMP%]{font-size:18px}.info[_ngcontent-%COMP%]   .data_container[_ngcontent-%COMP%]{width:calc(100% + 15px);max-height:230px;overflow-y:auto;padding-right:15px}.data[_ngcontent-%COMP%]{display:flex;justify-content:space-between;align-items:center;height:40px;border-bottom:.5px solid #ccc}.data[_ngcontent-%COMP%]   .campo[_ngcontent-%COMP%]{font-size:14px;color:#787878;width:40%}.data[_ngcontent-%COMP%]   .detalle[_ngcontent-%COMP%]{font-size:15px;color:#404040;width:100%;font-weight:400}.info[_ngcontent-%COMP%]   a[_ngcontent-%COMP%]{position:absolute;text-decoration:none;top:calc(100% - 40px);left:calc(100% - 300px);font-weight:600;font-size:15px}"]}),e})();var h=r(9814);function M(e,a){1&e&&(n.TgZ(0,"div",16),n._UZ(1,"mat-spinner"),n.qZA())}let v=(()=>{class e{constructor(t,o,c){this.administradorService=t,this._formBuilder=o,this._snackBar=c,this.spinner=!1,this.formSubmitted=!1,this.newAdminFormGroup=this._formBuilder.group({nombre:["",[i.kI.required]],apellidos:["",i.kI.required],celular:["",[i.kI.required,i.kI.minLength(6)]],correo:["",[i.kI.required,i.kI.email]],sexo:["",i.kI.required]})}ngOnInit(){this.token=localStorage.getItem("token")}createAdmin(){this.token=localStorage.getItem("token"),console.log(this.newAdminFormGroup.value),this.administradorService.postAdmin(this.token,this.newAdminFormGroup.value).subscribe({next:t=>{console.log(t),this.refresh()},error:t=>{console.error("There was an error!",t),this.openSnackBarBad()}})}openSnackBar(){this._snackBar.open("\u2714 El administrador ha sido creado","\u2716",{horizontalPosition:"start",verticalPosition:"bottom",duration:7e3})}openSnackBarBad(){this._snackBar.open("\u274c Admin no creado, revisa que los datos no esten en otra cuenta ","\u2716",{horizontalPosition:"start",verticalPosition:"bottom",duration:7e3})}refresh(){var t=this;return(0,p.Z)(function*(){t.spinner=!0,yield new Promise(o=>setTimeout(o,1500)),t.spinner=!1,t.newAdminFormGroup.reset(),t.openSnackBar()})()}}return e.\u0275fac=function(t){return new(t||e)(n.Y36(l.p),n.Y36(i.qu),n.Y36(u.ux))},e.\u0275cmp=n.Xpm({type:e,selectors:[["app-nuevo-admin"]],decls:43,vars:3,consts:[["action","#","autocomplete","off",1,"container",3,"formGroup"],[1,"header"],[1,"top"],["type","submit",1,"btn","btn-warning","btn-sm",3,"disabled","click"],[1,"config"],[1,"user-details"],[1,"input-box"],[1,"detail"],["matInput","","type","text","formControlName","nombre","placeholder","Ingresa tu nombre"],["matInput","","type","text","formControlName","apellidos","placeholder","Ingresa tus apellidos"],["matInput","","type","number","formControlName","celular","placeholder","Ingresa tu n\xfamero celular"],["matInput","","type","email","formControlName","correo","placeholder","Ingresa tu n\xfamero celular"],["matInput","","aria-label","Select an option","formControlName","sexo","required",""],["value","Hombre"],["value","Mujer"],["class","spinner",4,"ngIf"],[1,"spinner"]],template:function(t,o){1&t&&(n.TgZ(0,"form",0)(1,"div",1)(2,"div",2)(3,"h4"),n._uU(4,"Nuevo administrador"),n.qZA(),n.TgZ(5,"button",3),n.NdJ("click",function(){return o.createAdmin()}),n._uU(6," Crear Administrador "),n.qZA()(),n.TgZ(7,"p"),n._uU(8,"Al crear un nuevo administrador, asegurate de que los datos sean los correctos"),n.qZA(),n._UZ(9,"br"),n.qZA(),n.TgZ(10,"div",4)(11,"h4"),n._uU(12,"Crear administrador"),n.qZA(),n.TgZ(13,"div",5)(14,"h4"),n._uU(15,"DATOS"),n.qZA(),n.TgZ(16,"div",6)(17,"span",7),n._uU(18,"Nombre"),n.qZA(),n._UZ(19,"input",8),n.qZA(),n.TgZ(20,"div",6)(21,"span",7),n._uU(22,"Apellidos"),n.qZA(),n._UZ(23,"input",9),n.qZA(),n.TgZ(24,"div",6)(25,"span",7),n._uU(26,"N\xfamero celular"),n.qZA(),n._UZ(27,"input",10),n.qZA(),n.TgZ(28,"div",6)(29,"span",7),n._uU(30,"Correo"),n.qZA(),n._UZ(31,"input",11),n.qZA(),n.TgZ(32,"div",6)(33,"span",7),n._uU(34,"Sexo"),n.qZA(),n._UZ(35,"br")(36,"br"),n.TgZ(37,"mat-radio-group",12)(38,"mat-radio-button",13),n._uU(39,"Hombre"),n.qZA(),n.TgZ(40,"mat-radio-button",14),n._uU(41,"Mujer"),n.qZA()()()()()(),n.YNc(42,M,2,0,"div",15)),2&t&&(n.Q6J("formGroup",o.newAdminFormGroup),n.xp6(5),n.Q6J("disabled",o.newAdminFormGroup.invalid),n.xp6(37),n.Q6J("ngIf",o.spinner))},directives:[i._Y,i.JL,i.sg,m.Nt,i.Fj,i.JJ,i.u,i.wV,h.VQ,i.Q7,h.U0,s.O5,f.Ou],styles:["h4[_ngcontent-%COMP%]{font-size:23px;font-weight:600;margin-bottom:20px}p[_ngcontent-%COMP%]{font-size:14px}.container[_ngcontent-%COMP%]{height:100%;display:flex;flex-direction:column;justify-content:space-between}.header[_ngcontent-%COMP%]{width:100%;height:auto;border-bottom:.5px solid rgb(207,207,207)}.top[_ngcontent-%COMP%]{display:flex;justify-content:space-between;align-items:center}.config[_ngcontent-%COMP%]{width:100%;height:100%;border-radius:5px;padding:30px 0;overflow-y:auto}.config[_ngcontent-%COMP%]   h4[_ngcontent-%COMP%]{font-size:18px}.user-details[_ngcontent-%COMP%]{width:100%;padding-top:20px;padding-bottom:5px}.user-details[_ngcontent-%COMP%]   h4[_ngcontent-%COMP%]{font-size:13px;font-weight:400;color:#a5a5a5}.user-details[_ngcontent-%COMP%]   .input-box[_ngcontent-%COMP%]{display:flex;justify-content:flex-start;align-items:center;margin-bottom:15px}.user-details[_ngcontent-%COMP%]   .input-box[_ngcontent-%COMP%]   .detail[_ngcontent-%COMP%]{color:#494949;font-size:14px;font-weight:400;margin-bottom:5px;width:200px}.user-details[_ngcontent-%COMP%]   .input-box[_ngcontent-%COMP%]   input[_ngcontent-%COMP%]{height:35px;width:300px;outline:none;border-radius:5px;border:1px solid #ccc;padding-left:15px;font-size:15px;transition:all .3s ease}.user-details[_ngcontent-%COMP%]   .input-box[_ngcontent-%COMP%]   input[_ngcontent-%COMP%]:focus, .user-details[_ngcontent-%COMP%]   .input-box[_ngcontent-%COMP%]   input[_ngcontent-%COMP%]:valid{border-color:#255388}.gender-details[_ngcontent-%COMP%]   .gender-title[_ngcontent-%COMP%]{font-size:20px;font-weight:500}.mat-radio-button[_ngcontent-%COMP%] ~ .mat-radio-button[_ngcontent-%COMP%]{margin-left:16px}.spinner[_ngcontent-%COMP%]{position:fixed;top:0;left:0;width:100%;height:100vh;background:rgba(119,119,119,.492);z-index:99;display:flex;align-items:center;justify-content:center}"]}),e})();function Z(e,a){if(1&e&&(n.TgZ(0,"div",9)(1,"div",10)(2,"div",11),n._UZ(3,"img",12),n.qZA(),n.TgZ(4,"div",13)(5,"div",14)(6,"p"),n._uU(7),n.qZA()(),n.TgZ(8,"div",15)(9,"p"),n._uU(10),n.qZA()()(),n.TgZ(11,"div",16)(12,"ul",17)(13,"li")(14,"a",18),n._uU(15,"Informaci\xf3n general"),n.qZA()(),n.TgZ(16,"li")(17,"a",19),n._uU(18,"Configuraci\xf3n de datos"),n.qZA()(),n.TgZ(19,"li")(20,"a",20),n._uU(21,"Nuevo administrador"),n.qZA()()()()(),n.TgZ(22,"div",21),n._UZ(23,"router-outlet"),n.qZA()()),2&e){const t=n.oxw();n.xp6(3),n.s9C("src",t.adminData.imagen,n.LSH),n.xp6(4),n.AsE(" ",t.adminData.nombre," ",t.adminData.apellidos," "),n.xp6(3),n.hij(" ",t.adminData.correo," ")}}const A=[{path:"",component:(()=>{class e{constructor(t){this.administradorService=t}ngOnInit(){this.token=localStorage.getItem("token"),this.administradorService.getAdmin(this.token).subscribe({next:t=>this.adminData=t})}}return e.\u0275fac=function(t){return new(t||e)(n.Y36(l.p))},e.\u0275cmp=n.Xpm({type:e,selectors:[["app-sidebar"]],decls:13,vars:1,consts:[[1,"top"],[1,"navbar"],[1,"back"],["routerLink","../"],[1,"bx","bx-left-arrow-circle"],[1,"titulo"],[1,"logo"],["src","assets/img/logo.png","alt",""],["class","content",4,"ngIf"],[1,"content"],[1,"sidebar"],[1,"imagenUsuario"],["alt","",3,"src"],[1,"perfil"],[1,"nombre"],[1,"correo"],[1,"menu"],[1,"links"],["routerLink","overview"],["routerLink","settings"],["routerLink","new-admin"],[1,"info"]],template:function(t,o){1&t&&(n.TgZ(0,"body")(1,"div",0)(2,"div",1)(3,"div",2)(4,"a",3),n._UZ(5,"i",4),n._uU(6," Regresar "),n.qZA()(),n.TgZ(7,"div",5),n._uU(8," CONFIGURACI\xd3N "),n.qZA(),n.TgZ(9,"div",6)(10,"a",3),n._UZ(11,"img",7),n.qZA()()()(),n.YNc(12,Z,24,4,"div",8),n.qZA()),2&t&&(n.xp6(12),n.Q6J("ngIf",o.adminData))},directives:[d.yS,s.O5,d.lC],styles:['@import"https://fonts.googleapis.com/css2?family=Poppins:wght@200;300;400;500;600;700&display=swap";*[_ngcontent-%COMP%]{margin:0;padding:0;box-sizing:border-box;font-family:Poppins,sans-serif}body[_ngcontent-%COMP%]{min-height:100vh}.material-icons[_ngcontent-%COMP%]{font-family:Material Icons!important}.top[_ngcontent-%COMP%]{top:0;left:0;width:100%;height:100%;height:70px;background:#ffffff;box-shadow:0 1px 5px #0003;z-index:99}.top[_ngcontent-%COMP%]   .navbar[_ngcontent-%COMP%]{height:100%;max-width:1250px;width:100%;display:flex;align-items:center;justify-content:space-between;margin:auto;padding:0 50px}.top[_ngcontent-%COMP%]   .navbar[_ngcontent-%COMP%]   a[_ngcontent-%COMP%]{text-decoration:none;white-space:nowrap;color:#00367d;font-size:25px;font-weight:400;display:flex;align-items:center}.top[_ngcontent-%COMP%]   .navbar[_ngcontent-%COMP%]   a[_ngcontent-%COMP%]   i[_ngcontent-%COMP%]{margin:0 10px;font-size:25px}.top[_ngcontent-%COMP%]   .navbar[_ngcontent-%COMP%]   a[_ngcontent-%COMP%]:hover{color:#005acf;transition:.2s}.top[_ngcontent-%COMP%]   .navbar[_ngcontent-%COMP%]   .logo[_ngcontent-%COMP%]   img[_ngcontent-%COMP%]{max-height:35px;width:auto}.top[_ngcontent-%COMP%]   .navbar[_ngcontent-%COMP%]   .titulo[_ngcontent-%COMP%]{font-size:25px;font-weight:500;color:#494949}body[_ngcontent-%COMP%]   .content[_ngcontent-%COMP%]{margin-top:10px;display:flex;width:100%;height:88vh;justify-content:space-between}.content[_ngcontent-%COMP%]   .sidebar[_ngcontent-%COMP%]{width:500px;padding:20px 0;border-right:1px solid rgb(183,183,183)}.perfil[_ngcontent-%COMP%]{margin-bottom:50px}.sidebar[_ngcontent-%COMP%]   .imagenUsuario[_ngcontent-%COMP%]{width:150px;height:150px;overflow:hidden;margin:40px auto;position:relative;box-shadow:10px 10px 20px #ccc;border-radius:50%}.imagenUsuario[_ngcontent-%COMP%]   img[_ngcontent-%COMP%]{position:absolute;left:-100%;right:-100%;margin:auto;height:150px}.nombre[_ngcontent-%COMP%]{font-weight:600;font-size:20px;text-align:center}.correo[_ngcontent-%COMP%]{font-size:15px;text-align:center}.menu[_ngcontent-%COMP%]   .links[_ngcontent-%COMP%]{line-height:50px;height:100%}.menu[_ngcontent-%COMP%]   .links[_ngcontent-%COMP%]   li[_ngcontent-%COMP%]{align-items:center;list-style:none;padding-left:15px;border-top:.2px solid #ccc;border-bottom:.2px solid #ccc}.menu[_ngcontent-%COMP%]   li[_ngcontent-%COMP%]   a[_ngcontent-%COMP%]{height:100%;text-decoration:none;white-space:nowrap;color:#3c3c3c;font-size:17px;font-weight:400}.menu[_ngcontent-%COMP%]   li[_ngcontent-%COMP%]:hover{color:#3c3c3c;border-left:5px solid rgb(60,60,60);background:rgb(237,237,237)}.content[_ngcontent-%COMP%]   .info[_ngcontent-%COMP%]{width:100%;height:100%;padding:40px 20px 0 60px;overflow-y:auto}']}),e})(),children:[{path:"overview",component:P},{path:"settings",component:b},{path:"new-admin",component:v},{path:"**",redirectTo:"overview"}]}];let w=(()=>{class e{}return e.\u0275fac=function(t){return new(t||e)},e.\u0275mod=n.oAB({type:e}),e.\u0275inj=n.cJS({imports:[[d.Bz.forChild(A)],d.Bz]}),e})();var y=r(7959);let U=(()=>{class e{}return e.\u0275fac=function(t){return new(t||e)},e.\u0275mod=n.oAB({type:e}),e.\u0275inj=n.cJS({imports:[[s.ez,w,i.u5,y.q,i.UX]]}),e})()}}]);