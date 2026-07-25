import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Sidebar } from "@app/pages/chat/components/sidebar/sidebar";

@Component({
    selector: 'app-main-layout',
    imports: [RouterOutlet, Sidebar],
    templateUrl: './main-layout.html',
})
export class MainLayout {}