import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { routes } from './app.routes'; // Import routes configuration
import { MainComponent } from './main/main.component';
import { BalanceComponent } from './balance/balance.component';
import { SendMoneyComponent } from './send-money/send-money.component';
import { DepositMoneyComponent } from './deposit-money/deposit-money.component';
import { TaxesComponent } from './taxes/taxes.component';
import { HistoryComponent } from './history/history.component';

@NgModule({
  declarations: [
    MainComponent, 
    BalanceComponent,
    SendMoneyComponent,
    DepositMoneyComponent,
    TaxesComponent,
    HistoryComponent
  ],
  imports: [
    BrowserModule,
    RouterModule.forRoot(routes) // Import RouterModule with routes
  ],
  bootstrap: [MainComponent] // Bootstraps the MainComponent
})
export class AppModule {}
