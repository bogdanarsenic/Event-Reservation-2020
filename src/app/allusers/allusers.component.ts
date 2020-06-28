import { Component, OnInit } from '@angular/core';
import { User } from '../classes/User';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { ServerService } from '../services/server.service';

@Component({
  selector: 'app-allusers',
  templateUrl: './allusers.component.html',
  styleUrls: ['./allusers.component.css']
})
export class AllusersComponent implements OnInit {

  user:User;
  users:User[];
  sellerUsers:User[];
  sellerId:string;
  IsActive:string

  byRole:FormGroup;
  byGender:FormGroup;
  byId:FormGroup;
  role:string;
  id:string;
  gender:string;
  korisnik:User;


  Clicked:boolean;
  ClickedId:boolean;
  constructor(private router:Router,private service:ServerService,private fb:FormBuilder) {
    
    this.createForm();
  }

  createForm()
   {
   }
 
  ngOnInit()
   {
     this.Clicked=false
     this.ClickedId=false
     this.role=""
     this.gender=""
     this.id=""
     this.korisnik=new User("","","","","","","",0);
      this.user=new User("","","","","","","",0);
      this.users=[]
      this.sellerUsers=[]

      if(this.isAdmin())
      {
        this.service.GetAllUsers().subscribe(
          data=>{

                this.users=data;

          }
        )
      }   

      if(this.isSeller())
     {
        this.sellerId=sessionStorage.getItem('Username');
        this.service.GetAllUsersWhoReserved().subscribe(
          data=>
          {
              if(data.length==0)
              {
                alert("No users bought ticket for your event")
              }
              else
              {
                this.users=data;
              }
          }
        )
    }
      
  }


  ShowOthers()
  {
    this.Clicked=false;
    this.ClickedId=false;
  }
 

  isAdmin()
  {
    if(sessionStorage.getItem('Role')=="Admin")
    return true;
    else 
    return false;
  }

  isSeller()
  {
    if(sessionStorage.getItem('Role')=="Seller")
    return true;
    else 
    return false;
  }
}