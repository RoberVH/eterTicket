import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';   
import { FormBuilder, FormGroup } from '@angular/forms';
import { GetResBCService } from '../get-res-bc.service';

@Component({
  selector: 'app-comandos',
  templateUrl: './comandos.component.html',
  styleUrls: ['./comandos.component.css']
})

export class ComandosComponent implements OnInit {

public selecto:string;

  form: FormGroup;  
  arr: any[]=[];  
  constructor(private consultar:GetResBCService) { //private fb: FormBuilder
   
   }

  public onSubmit(form:NgForm){
  //console.log('Invocado: ',this.selecto);
  this.arr = form.value;
 // console.log('valores:: ',JSON.stringify(this.arr));
 
  switch (this.selecto) {
  case 'leerT':
        this.consultar.leerTicket(this.arr);
        break;
  case 'leerTs':
        this.consultar.leermultiplesTickets(this.arr);
        break;  
  case 'saldoCte':
        this.consultar.leersaldoCte(this.arr);
        break;  
  case 'hptscjs':              
        this.consultar.leerhptscjs(this.arr);
        break;  
  }


  }

  
  ngOnInit() {
  }

}
