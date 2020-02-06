import { Component, OnInit } from '@angular/core';
import { DataService } from 'src/app/core/data.service';
import { IngredientPage, Ingredient } from 'src/app/shared/interfaces';
import { ToastrService } from 'ngx-toastr';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ConfirmationDialogComponent } from 'src/app/shared/confirmation-dialog/confirmation-dialog.component';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-admin-ingredients',
  templateUrl: './admin-ingredients.component.html',
  styleUrls: ['./admin-ingredients.component.scss']
})
export class AdminIngredientsComponent implements OnInit {

  ingredientText: string;

  ingredientPage: IngredientPage;
  page = 0;

  constructor(private dataService: DataService,
              private toastr: ToastrService,
              private modalService: NgbModal,
              private route: ActivatedRoute) { }

  ngOnInit() {
    this.route.data.subscribe(data => {
      const resolvedData: IngredientPage = data['resolvedData'];
      this.onIngredientsRetrieved(resolvedData);
    });
  }

  onIngredientsRetrieved(resolvedData: IngredientPage): void {
    this.ingredientPage = { ...resolvedData };
  }

  getIngredientPage(): void {
    this.dataService.getIngredientsPage(this.page)
    .subscribe({
      next: response => {
        console.log(response);
        this.ingredientPage = { ...response };
      },
      error: error => {
        console.error(error);
      }
    });
  }

  addIngredient(): void {
    const ingredient: Ingredient = { name: this.ingredientText };

    this.dataService.addIngredient(ingredient)
    .subscribe({
      next: response => {
        this.toastr.success('Dodano nowy składnik!', '', {
          positionClass: 'toast-top-center'
        });
        this.ingredientText = null;
      },
      error: error => {
        console.error(error);
      },
      complete: () => {
        setTimeout(() => window.location.reload(), 1000);
      }
    });
  }

  deleteIngredient(ingredient: Ingredient): void {
    this.dataService.deleteIngredient(ingredient.id)
    .subscribe({
      next: response => {
        this.toastr.success('Pomyślnie usunięto składnik.', '', {
          positionClass: 'toast-top-center'
        });
      },
      error: error => {
        console.error(error);
      },
      complete: () => {
        setTimeout(() => window.location.reload(), 1000);
      }
    });
  }

  changePage(page: number): void {
    this.page = page;
    this.getIngredientPage();
  }

  pageNav(): boolean {
    return typeof this.ingredientPage === 'undefined' || this.ingredientPage.totalPages < 2;
  }

  openConfirmation(ingredient: Ingredient): void {
    const modalRef = this.modalService.open(ConfirmationDialogComponent, {
        centered: true,
        backdrop: 'static',
        keyboard: false
      });

    modalRef.componentInstance.message = 'Czy jesteś pewien, aby usunąć składnik: ' + ingredient.name;

    modalRef.result.then((result) => {
      if (result === 'Confirm') {
        this.deleteIngredient(ingredient);
      }
    });
  }
}
