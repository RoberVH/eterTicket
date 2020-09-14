import { Component, OnInit } from '@angular/core';
import { GetResBCService } from '../get-res-bc.service';

@Component({
  selector: 'app-body',
  templateUrl: './body.component.html',
  styleUrls: ['./body.component.css']
})
export class BodyComponent implements OnInit {

  public viewMode;
  public Ticket={};
  public CtaCte={};
  public histCanje={};
  public MsjDesplegableError='';


  constructor(public servResultados:GetResBCService) { 
    this.viewMode='inicial';
    servResultados.mostrarResultados.subscribe((objResul:any)=> {
      console.log('objResul ', objResul);
      switch (objResul['tipoResul']) {
        case 'UnTicket':
          this.Ticket=objResul['Ticket'];
          console.log('En Body, ticket es: ', this.Ticket);
          this.viewMode='UnTicket';
          break;
        case 'SinResults':
          this.viewMode='SinResults';
          console.log('En Body, SinResults');          
          break;
        case 'variosHeaders':
          this.Ticket=objResul['Ticket'];
          this.viewMode='variosHeaders';
          console.log('En Body, variosHeaders');          
          break;
        case 'SinParametros':
          this.viewMode='SinParametros';
          break;
        case 'CtaCte':
          this.CtaCte=objResul['CtaCte'][0];
          console.log('CtaCte ', this.CtaCte); //this.MsjError=
          this.viewMode='CtaCte';
          break;     
        case 'hptscjs':
          this.histCanje=objResul['histCanje'];
          console.log('histCanje ', this.histCanje); //this.MsjError=
          this.viewMode='hptscjs';
          break;                 
        case 'MsjError':
          let miobj=objResul['error'];
          console.log('Obj Error ', miobj); //this.MsjError=
          if (miobj.error.message!=null){
          this.MsjDesplegableError="Error " + miobj.status + ". Razon: " + miobj.error.message;
          } else {
            this.MsjDesplegableError="Error " + miobj.status + ". Razon: " + miobj.error;
          }

          this.viewMode='MsjError';
          break;
         
           

      }
    })
  }

  ngOnInit() {
  }
  public desp_1ticket(ticket:any){
 
  }

}
