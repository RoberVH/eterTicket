import {ticketHdr} from './tickethdr';
import {formasPago} from './formasPago';
import {ticketLinea} from './ticketline';

export class ticket {
header:ticketHdr;
pagos:formasPago[];
lineas:ticketLinea[];
}