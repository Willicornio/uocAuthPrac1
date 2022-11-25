import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import {Token} from '../models/token'
import {User} from '../models/user'


@Component({
  selector: 'app-principal',
  templateUrl: './principal.component.html',
  styleUrls: ['./principal.component.css']
})





export class PrincipalComponent implements OnInit {


  

  constructor(private httpClient: HttpClient) { }

  token : Token = new Token()
  user : User = new User()

  newToken: any = "";
  newTokenExpiration: any = ""

  foto: any = "";
  ngOnInit(): void {
  }

  onClick(){
    this.getAutherizationCode();
  }

  //Función que va al login de linkedin,como quieres el code, la respueta será code, luego le pasas tu cliente id y la url de redirección, al volver te trae en la url el code necesario para luego recuperar el token
   getAutherizationCode() {
    window.location.replace("https://www.linkedin.com/uas/oauth2/authorization?response_type=code&client_id=772aaowv9h0wt0&redirect_uri=http://localhost:4200/principal&state=123456&scope=w_member_social,r_liteprofile");
  }


  //Función para recuperear el code de la url
  getParameterByName(name: string){
        var url = window.location.href;
        name = name.replace(/[\[\]]/g, '\\$&');
        let regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
            results = regex.exec(url);
        if (!results) return null;
        if (!results[2]) return '';
        return decodeURIComponent(results[2].replace(/\+/g, ' '));
  }

//funcionar para pedir el token access, le pasas tu cliente id y secreto, además del code de antes. Al querer el accesToken, vemos que es /accesToken y te autorizas
//mediante el code
  geta(){
    if (this.getParameterByName("code")) {
      var authorizationCode = this.getParameterByName("code");
      this.httpClient.post("https://www.linkedin.com/oauth/v2/accessToken?grant_type=authorization_code&client_id=772aaowv9h0wt0&client_secret=GO6RG7NFq1zdQate&code="+ authorizationCode +"&redirect_uri=http://localhost:4200/principal" 
      ,{},{headers : {'Content-Type':'application/x-www-form-urlencoded'}}).subscribe(data => {
        console.log(data);
        this.token = data as Token;
    });
  }
 }

 //Para obtener la información del usuario: en un /me y simplemente pasandole el token sirve
 getInfoUser(){
  this.httpClient.get("https://api.linkedin.com/v2/me?oauth2_access_token="+this.token.access_token
      ,{headers : {'Content-Type':'application/x-www-form-urlencoded'}}).subscribe(data => {
        console.log(data);       


        this.user = data as User;
        const arrayData = Object.values(data);
        this.foto = Object.values(arrayData[1]);
    });
 }


 errorToken()
 {
  this.httpClient.get("https://api.linkedin.com/v2/me?oauth2_access_token="+"12345aasdsadd23"
      ,{headers : {'Content-Type':'application/x-www-form-urlencoded'}}).subscribe(data => {
        this.user = data as User;
    });

 }
 
//Para refrescar el token, pero por cambios de linkedin de momento este punto no está funcional
 refreshToken(){
  this.httpClient.post("https://www.linkedin.com/oauth/v2/accessToken?grant_type=refresh_token&access_token="+ this.token.access_token + "&client_id=772aaowv9h0wt0&client_secret=GO6RG7NFq1zdQate"
  ,{},{headers : {'Content-Type':'application/x-www-form-urlencoded'}}).subscribe(data => {
    console.log(data);
});
 }



 postComment(){

console.log(this.user.id);
  const body = 

  {
      "author": "urn:li:person:"+ this.user.id,
      "lifecycleState": "PUBLISHED",
      "specificContent": {
        "com.linkedin.ugc.ShareContent": {
          "shareCommentary": {
            "text": "Learning more about LinkedIn by reading the LinkedIn Blog2222222!"
          },
          "shareMediaCategory": "ARTICLE",
          "media": [
            {
              "status": "READY",
              "description": {
                "text": "Official L22222inkedIn Blog - Your source for insights and information about LinkedIn."
              },
              "originalUrl": "https://blog.linkedin.com/",
              "title": {
                "text": "Official Linke2222dIn Blog"
              }
            }
          ]
        }
      },
      "visibility": {
        "com.linkedin.ugc.MemberNetworkVisibility": "CONNECTIONS"
      
    }
    
};
    this.httpClient.post("http://localhost:3000"
        ,
{       body
},{headers : {
  'Authorization': 'Bearer ' + this.token.access_token, 
'X-Restli-Protocol-Version': '2.0.0',
'Content-Type': 'application/json',
'Target-URL': 'https://api.linkedin.com/v2/ugcPosts' },
 }       
        
        ).subscribe(data => {
          console.log(data);       
      });
   }

}
