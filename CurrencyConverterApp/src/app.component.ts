import { Component } from '@angular/core';
import { FixerCurrencyModel } from './fixer.currency.model';
import { ExchangeService } from './exchange.service';
import { CurrencySelectComponent } from  './currency-select.component';
import { FixedPipe } from './fixed.pipe';

@Component({
  selector: 'currency-converter',  
  template: `
    Convert: <input type="number" [(ngModel)]="baseAmount"
      [ngClass]="{error:isInvalid(baseAmount), warning: baseAmount < 0}"
      > 
      <currency-select [(selected)]="baseCurrency"></currency-select>
     = <strong>{{getTargetAmount() | fixed}}</strong> 
      <currency-select [(selected)]="targetCurrency"
        (selectedChange)="targetCurrency=$event"></currency-select>
     <template [ngIf]= "isInvalid(baseAmount)">
        <p>Please enter a valid amount</p>
     </template>
     <p *ngIf!= "isInvalid(baseAmount)">Exchange Rate 
        <strong>{{exchangeRate | fixed:4}}</strong>
     </p>   
  `,
  styles: [`
    input[type=number] {
      width: 10ex;
      text-align: right;
    }
    .error {
        background-color: #ff6666
    }
  `]
})
export class AppComponent {

  baseCurrency = 'USD';
  targetCurrency = 'GBP';
  baseAmount = 1;
  
  constructor(private exchangeService: ExchangeService){
    this.exchangeService.errorHandler = error =>
      window.alert('Oops! The server request failed.');
    this.reload();
  };
  
  getTargetAmount() {
    const lexchangeRate = this.exchangeService.getExchangeRate(this.baseCurrency, this.targetCurrency);
    if (lexchangeRate) {
        //this.exchangeRate = exchangeRate;
        return (this.baseAmount * lexchangeRate);
    } else { 
      return this.baseAmount;
    }
  }

  isInvalid(value)
  {
    return !Number.isFinite(value);
  }

  private reload() {
    return this.exchangeService.getExchangeRate(this.baseCurrency, this.targetCurrency);
  }
  
  get exchangeRate()
  {                
    const lexchangeRate = this.exchangeService.getExchangeRate(this.baseCurrency, this.targetCurrency);
    if (lexchangeRate)
      return lexchangeRate;
    else
      return 0.70;
    
  }

  
}
