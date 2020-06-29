import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ServerService } from '../services/server.service';
import { Router } from '@angular/router';
import { Ticket } from '../classes/Ticket';
import { Comment } from '../classes/Comment';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-comments',
  templateUrl: './comments.component.html',
  styleUrls: ['./comments.component.css']
})
export class CommentsComponent implements OnInit {


    commentUserForm:FormGroup;
    idEvent:string
    userId:string
    allComments:Comment[]
    approvedComment:Comment
    Approve:boolean
    ticket:Ticket
    CanWrite:boolean
    buyer:string

    datePipe = new DatePipe('en-US');

    todayDate=Date.now();

    today = this.datePipe.transform(this.todayDate, 'MM/dd/yyyy HH:mm:ss');
  
    comment:Comment
    constructor(private router:Router,private server:ServerService,private fb:FormBuilder)
     {
      this.createForm();
     }
  
     createForm()
     {
       this.commentUserForm=this.fb.group({
  
        Text: ['',Validators.required],
        Rate:[,Validators.required]
        
       })
      }
  
    ngOnInit() {
  
      this.Approve=false;
      this.allComments=[]
      this.ticket
      this.CanWrite=false;
      this.comment=new Comment("","",0,"","");
      this.idEvent=sessionStorage.getItem('EventId');
      this.userId=sessionStorage.getItem('Username');  
  
      if(this.IsSeller() || this.IsAdmin())
      {
        this.server.GetComment(this.idEvent).subscribe(
          data=>
          {
            this.allComments=data;           
          }
        )
      }
    else
        {
  
  
        this.server.GetComment(this.idEvent).subscribe(
                data=>
                {
                  if(data!=null)
                  {
                  data.forEach(
                    element=>
                    {
                        if(element.IsActive==true)
                        {
                          this.approvedComment=element;
                          this.allComments.push(this.approvedComment);
                        }
                    }
                  )
                  }
                }
              )
          
        if(this.IsBuyer())
          {

              this.server.GetUserByUsername(this.userId).subscribe(
                data=>
                {
                    this.buyer=data.Name+" "+data.Surname;
                    this.getTicket();
                }
              )      
            }            
          }
          
      
    }

    getTicket()
    {
      
      this.server.GetTicketUserEvent(this.buyer,this.idEvent).subscribe(
        data=>
        {
          if(data!=null)
          {
            this.ticket=data;
            let eventTime=new Date(this.ticket.EventTime);
            let todayTime=new Date(this.today);

            if(eventTime<todayTime && this.ticket.Status=="Reserved")
            {
                this.CanWrite=true;
            }
          }

        }
      )
    }

    
    ApproveNow(comId:string)
    {

        this.server.ApproveComment(comId).subscribe(
          data=>
          {
            this.router.navigate(['/comments']).then(()=>window.location.reload());
          }
        )
    }
   
  
    onSubmit()
    {
        this.comment.Rating=this.commentUserForm.value.Rate;
        this.comment.Text=this.commentUserForm.value.Text;
        this.comment.ManifestationId=this.idEvent;
        this.comment.IsActive=false;
        this.comment.UserId=this.userId;

        this.server.postComment(this.comment).subscribe(
          data=>
          {
            this.router.navigate(['/home']).then(()=>window.location.reload());
          })
    }
  
    IsBuyer()
    {
      if(sessionStorage.getItem('Role')=="Buyer")
      {
        return true;
      }
      return false;
    }

    IsAdmin()
    {
      if(sessionStorage.getItem('Role')=="Admin")
      {
          return true;
      }
      return false;
    }
    IsSeller()
    {
      if(sessionStorage.getItem('Role')=="Seller")
      {
        return true;
      }
      return false;
    }
}
