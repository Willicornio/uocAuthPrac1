import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';



@Component({
  selector: 'app-principal',
  templateUrl: './principal.component.html',
  styleUrls: ['./principal.component.css']
})


export class PrincipalComponent implements OnInit {

  constructor(private httpClient: HttpClient) { }

  //mi cleite secreto : GO6RG7NFq1zdQate
  token : any = "";
  tokenExpiration: any = "";

  newToken: any = "";
  newTokenExpiration: any = ""

  name: any = "";
  lastname: any = "";
  foto: any = "";
  id: any ="";
  ngOnInit(): void {
  }

  onClick(){
    console.log("Hey");
    this.getAutherizationCode();
  }

   getAutherizationCode() {
    window.location.replace("https://www.linkedin.com/uas/oauth2/authorization?response_type=code&client_id=772aaowv9h0wt0&redirect_uri=http://localhost:4200/principal&state=123456&scope=r_liteprofile");
  }


  getParameterByName(name: string){
        var url = window.location.href;
        name = name.replace(/[\[\]]/g, '\\$&');
        let regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
            results = regex.exec(url);
        if (!results) return null;
        if (!results[2]) return '';
        return decodeURIComponent(results[2].replace(/\+/g, ' '));
  }


  geta(){
    if (this.getParameterByName("code")) {
      var authorizationCode = this.getParameterByName("code");
      this.httpClient.post("https://www.linkedin.com/oauth/v2/accessToken?grant_type=authorization_code&client_id=772aaowv9h0wt0&client_secret=GO6RG7NFq1zdQate&code="+ authorizationCode +"&redirect_uri=http://localhost:4200/principal" 
      ,{},{headers : {'Content-Type':'application/x-www-form-urlencoded'}}).subscribe(data => {
        console.log(data);
        
        const arrayData = Object.values(data);
        this.token = arrayData[0];
        this.tokenExpiration = arrayData[1];
    });
  }
 }

 getInfoUser(){
  this.httpClient.get("https://api.linkedin.com/v2/me?oauth2_access_token="+this.token
      ,{headers : {'Content-Type':'application/x-www-form-urlencoded'}}).subscribe(data => {
        console.log(data);       
        const arrayData = Object.values(data);
        this.name = arrayData[5];
        this.lastname =  arrayData[0]
        this.foto = Object.values(arrayData[1]);
        this.id = Object.values(arrayData[4]);
    });
 }


 
 

 refreshToken(){
  this.httpClient.post("https://www.linkedin.com/oauth/v2/accessToken?grant_type=refresh_token&access_token="+ this.token + "&client_id=772aaowv9h0wt0&client_secret=GO6RG7NFq1zdQate"
  ,{},{headers : {'Content-Type':'application/x-www-form-urlencoded'}}).subscribe(data => {
    console.log(data);
    
    const arrayData = Object.values(data);
    this.token = arrayData[0];
    this.tokenExpiration = arrayData[1];
    this.newToken = arrayData[2];
    this.newTokenExpiration = arrayData[3];
});
 }



 postComment(){


  const body = 

  {
    "token": this.token,
    "author": "urn:li:person:" + this.id,
    "lifecycleState": "PUBLISHED",
    "specificContent": {
        "com.linkedin.ugc.ShareContent": {
            "shareCommentary": {
                "text": "A text from LinkedIn API."
            },
            "shareMediaCategory": "ARTICLE",
            "media": [
                {
                    "status": "READY",
                    "description": {
                        "text": "The description field coming from LinkedIn API."
                    },
                    "originalUrl": "https://blog.linkedin.com/",
                    "title": {
                        "text": "Testing LinkedIn API"
                    }
                }
            ]
        }
    },
    "visibility": {
        "com.linkedin.ugc.MemberNetworkVisibility": "PUBLIC"
    }
};
  //,{headers : {'Authorization': 'Bearer ' + this.token, 
// 'X-Restli-Protocol-Version': '2.0.0',
// 'Content-Type': 'json'  
    this.httpClient.post("https://www.linkedin.com/oauth/v2/ugcPosts?oauth2_access_token="+this.token
        ,
{       body
},{headers : {
  'Content-Type':'application/x-www-form-urlencoded'},
 }       
        
        ).subscribe(data => {
          console.log(data);       
          const arrayData = Object.values(data);
          this.name = arrayData[5];
          this.lastname =  arrayData[0]
          this.foto = Object.values(arrayData[1]);
      });
   }

}
