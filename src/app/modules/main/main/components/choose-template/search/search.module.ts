import { NgModule } from "@angular/core";
import { MatIconModule } from "@angular/material/icon";
import { SharedModule } from "@app/shared/shared.module";
import { SearchComponent } from "./search.component";

@NgModule({
    declarations: [
        SearchComponent
    ],
    imports: [
        SharedModule,
        MatIconModule
    ],
    exports: [
        SearchComponent
    ]
})

export class SearchModule {

}