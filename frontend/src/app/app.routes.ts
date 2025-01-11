import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { WelcomeComponent } from './welcome/welcome.component';
import { MainComponent } from './main/main.component'; 
import { BalanceComponent } from './balance/balance.component'; 
import { SendMoneyComponent } from './send-money/send-money.component';
import { DepositMoneyComponent } from './deposit-money/deposit-money.component';
import { TaxesComponent } from './taxes/taxes.component';
import { HistoryComponent } from './history/history.component'; 

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'welcome',
    pathMatch: 'full',
  },
  {
    path: 'welcome',
    component: WelcomeComponent,
  },
  {
    path: 'login',
    component: LoginComponent,
  },
  {
    path: 'register',
    component: RegisterComponent,
  },
  {
    path: 'main',
    component: MainComponent, 
  },
  {
    path: 'balance',
    component: BalanceComponent,
  },
  {
    path: 'send-money',
    component: SendMoneyComponent, 
  },
  {
    path: 'deposit-money',
    component: DepositMoneyComponent, 
  },
  {
    path: 'taxes',
    component: TaxesComponent, 
  },
  {
    path: 'history',
    component: HistoryComponent, 
  }
];
