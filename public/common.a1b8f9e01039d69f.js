"use strict";(self.webpackChunkjopaka=self.webpackChunkjopaka||[]).push([[592],{87:(_,h,a)=>{a.d(h,{i:()=>s});var o=a(8505),d=a(2340),i=a(5e3),p=a(520),u=a(1083);let s=(()=>{class l{constructor(e,r,n){this.http=e,this.router=r,this.ngZone=n,this.baseUrl=d.N.baseUrl,this.googleInit()}googleInit(){return new Promise(e=>{gapi.load("auth2",()=>{this.auth2=gapi.auth2.init({client_id:"86407381520-b22aanmqdi3q61d62sec545cr2curik1.apps.googleusercontent.com",cookiepolicy:"sinost_origin"}),e()})})}logout(){localStorage.removeItem("token"),localStorage.removeItem("role"),this.userRole="",this.auth2.signOut().then(()=>{this.ngZone.run(()=>{this.router.navigateByUrl("/jopaka")})})}getRole(){return this.userRole=localStorage.getItem("role"),this.userRole}crearUsuario(e){return console.log("creado usuario"),this.http.post(`${this.baseUrl}/auth/cliente`,e)}crearSolicitud(e){return console.log("generadno solicitud"),this.http.post(`${this.baseUrl}/auth/nutriologo`,e)}loginGoogle(e){return this.http.post(`${this.baseUrl}/auth/logIn`,e).pipe((0,o.b)(r=>{localStorage.setItem("token",r.toekn)}))}validarToken(){return""!==(localStorage.getItem("token")||"")}generarCodigo(e){return this.http.get(`${this.baseUrl}/auth/sendCode?celular=${e}`)}verificarCodigo(e,r){return this.http.get(`${this.baseUrl}/auth/verifyCode?celular=${e}&code=${r}`)}}return l.\u0275fac=function(e){return new(e||l)(i.LFG(p.eN),i.LFG(u.F0),i.LFG(i.R0b))},l.\u0275prov=i.Yz7({token:l,factory:l.\u0275fac,providedIn:"root"}),l})()},6088:(_,h,a)=>{a.d(h,{p:()=>u});var o=a(520),d=a(2340),i=a(5e3),p=a(1083);let u=(()=>{class s{constructor(t,e){this.http=t,this.router=e,this.baseUrl=d.N.baseUrl,this.apiUrl=`${this.baseUrl}/administrador`}getUsuarios(t){return this.http.get(`${this.apiUrl}/user`,{headers:(new o.WM).set("jopakatoken",t)})}getNutriologos(t){return this.http.get(`${this.apiUrl}/nutriologo`,{headers:(new o.WM).set("jopakatoken",t)})}getBaneadosN(t){return this.http.get(`${this.apiUrl}/nutriologo?baneado=true`,{headers:(new o.WM).set("jopakatoken",t)})}getBaneadosC(t){return this.http.get(`${this.apiUrl}/user?baneado=true`,{headers:(new o.WM).set("jopakatoken",t)})}getSolicitudes(t){return this.http.get(`${this.apiUrl}/soli/`,{headers:(new o.WM).set("jopakatoken",t)})}getReportes(t,e){return this.http.get(`${this.apiUrl}/reporte/user?id=${e}`,{headers:(new o.WM).set("jopakatoken",t)})}deleteReporte(t,e){return this.http.put(`${this.apiUrl}/reporte/quitar/?id=${e}`,e,{headers:(new o.WM).set("jopakatoken",t)})}acceptRequest(t,e){return console.log("aceptando soli"),this.http.post(`${this.apiUrl}/soli/accepted`,{id:e},{headers:(new o.WM).set("jopakatoken",t)})}denyRequest(t,e){return console.log("denegando soli"),this.http.put(`${this.apiUrl}/soli/denied`,{id:e},{headers:(new o.WM).set("jopakatoken",t)})}getAdmin(t){return this.http.get(`${this.apiUrl}/data`,{headers:(new o.WM).set("jopakatoken",t)})}updateAdmin(t,e,r){const n=new FormData;return""!=e.imagen&&n.append("imagen",e.imagen),e.nombre!=r.nombre&&n.append("nombre",e.nombre),e.apellidos!=r.apellidos&&n.append("apellidos",e.apellidos),e.celular!=r.celular&&n.append("celular",e.celular),this.http.put(`${this.apiUrl}/update`,n,{headers:(new o.WM).set("jopakatoken",t)})}postAdmin(t,e){return this.http.post(`${this.baseUrl}/auth/administrador`,e,{headers:(new o.WM).set("jopakatoken",t)})}}return s.\u0275fac=function(t){return new(t||s)(i.LFG(o.eN),i.LFG(p.F0))},s.\u0275prov=i.Yz7({token:s,factory:s.\u0275fac,providedIn:"root"}),s})()},9603:(_,h,a)=>{a.d(h,{$:()=>u});var o=a(520),d=a(2340),i=a(5e3),p=a(1083);let u=(()=>{class s{constructor(t,e){this.http=t,this.router=e,this.baseUrl=d.N.baseUrl,this.apiUrl=`${this.baseUrl}/usuarios`}getProgreso(t,e){return this.http.get(`${this.apiUrl}/progreso?id=${e}`,{headers:(new o.WM).set("jopakatoken",t)})}getServicios(t){return this.http.get(`${this.apiUrl}/servicio`,{headers:(new o.WM).set("jopakatoken",t)})}getCliente(t){return this.http.get(`${this.apiUrl}/data`,{headers:(new o.WM).set("jopakatoken",t)})}getPagos(t){return this.http.get(`${this.apiUrl}/registroPagos`,{headers:(new o.WM).set("jopakatoken",t)})}getPago(t,e){return this.http.get(`${this.apiUrl}/pagos?index=${e}`,{responseType:"arraybuffer",headers:(new o.WM).set("jopakatoken",t)})}getDieta(t,e,r){return this.http.get(`${this.apiUrl}/historial?indice=${e}&id=${r}`,{responseType:"arraybuffer",headers:(new o.WM).set("jopakatoken",t)})}getExtras(t){return this.http.get(`${this.apiUrl}/extra`,{headers:(new o.WM).set("jopakatoken",t)})}updateCliente(t,e,r){const n=new FormData;return""!=e.imagen&&n.append("imagen",e.imagen),e.nombre!=r.nombre&&n.append("nombre",e.nombre),e.apellidos!=r.apellidos&&n.append("apellidos",e.apellidos),e.celular!=r.celular&&n.append("celular",e.celular),this.http.put(`${this.apiUrl}/`,n,{headers:(new o.WM).set("jopakatoken",t)})}postExtra(t,e){return this.http.post(`${this.apiUrl}/extra/alta`,e,{headers:(new o.WM).set("jopakatoken",t)})}deleteCliente(t){return this.http.delete(`${this.apiUrl}/`,{headers:(new o.WM).set("jopakatoken",t)})}}return s.\u0275fac=function(t){return new(t||s)(i.LFG(o.eN),i.LFG(p.F0))},s.\u0275prov=i.Yz7({token:s,factory:s.\u0275fac,providedIn:"root"}),s})()},3249:(_,h,a)=>{a.d(h,{l:()=>u});var o=a(520),d=a(2340),i=a(5e3),p=a(1083);let u=(()=>{class s{constructor(t,e){this.http=t,this.router=e,this.baseUrl=d.N.baseUrl,this.apiUrl=`${this.baseUrl}/nutriologo`}getPredeterminados(t){return this.http.get(`${this.apiUrl}/predeterminado`,{headers:(new o.WM).set("jopakatoken",t)})}createPredeterminado(t,e){return this.http.post(`${this.apiUrl}/predeterminado`,e,{headers:(new o.WM).set("jopakatoken",t)})}updatePredeterminado(t,e,r){return this.http.put(`${this.apiUrl}/predeterminado`,{nombreAnterior:e,nuevoNombre:r.nuevoNombre,texto:r.texto},{headers:(new o.WM).set("jopakatoken",t)})}deletePredeterminado(t,e){return this.http.delete(`${this.apiUrl}/predeterminado?nombre=${e}`,{headers:(new o.WM).set("jopakatoken",t)})}getNutriologo(t){return this.http.get(`${this.apiUrl}/data`,{headers:(new o.WM).set("jopakatoken",t)})}updateNutriologo(t,e,r){const n=new FormData;return""!=e.imagen&&n.append("imagen",e.imagen),e.nombre!=r.nombre&&n.append("nombre",e.nombre),e.apellidos!=r.apellidos&&n.append("apellidos",e.apellidos),e.celular!=r.celular&&n.append("celular",e.celular),this.http.put(`${this.apiUrl}/`,n,{headers:(new o.WM).set("jopakatoken",t)})}updateServicio(t,e){return this.http.put(`${this.apiUrl}/servicio`,e,{headers:(new o.WM).set("jopakatoken",t)})}updateHorario(t,e){return this.http.put(`${this.apiUrl}/fechas`,e,{headers:(new o.WM).set("jopakatoken",t)})}deleteNutriologo(t){return this.http.delete(`${this.apiUrl}/`,{headers:(new o.WM).set("jopakatoken",t)})}}return s.\u0275fac=function(t){return new(t||s)(i.LFG(o.eN),i.LFG(p.F0))},s.\u0275prov=i.Yz7({token:s,factory:s.\u0275fac,providedIn:"root"}),s})()},5861:(_,h,a)=>{function o(i,p,u,s,l,t,e){try{var r=i[t](e),n=r.value}catch(c){return void u(c)}r.done?p(n):Promise.resolve(n).then(s,l)}function d(i){return function(){var p=this,u=arguments;return new Promise(function(s,l){var t=i.apply(p,u);function e(n){o(t,s,l,e,r,"next",n)}function r(n){o(t,s,l,e,r,"throw",n)}e(void 0)})}}a.d(h,{Z:()=>d})}}]);