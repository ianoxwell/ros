import { HttpErrorResponse } from '@angular/common/http';
import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { UntypedFormArray, UntypedFormBuilder, UntypedFormControl, UntypedFormGroup } from '@angular/forms';
import { MatSelect } from '@angular/material/select';
import { ComponentBase } from '@components/base/base.component.base';
import { IIngredient } from '@DomainModels/ingredient.dto';
import { IScrollPositions } from '@models/common.model';
import { IEditedField, IMeasurement } from '@models/ingredient/ingredient-model';
import { MessageStatus } from '@models/message.model';
import { IReferenceAll, IReferenceItemFull } from '@models/reference.model';
import { ValidationMessages } from '@models/static-variables';
import { DialogService } from '@services/dialog.service';
import { IngredientEditFormService } from '@services/ingredient-edit-form.service';
import { MessageService } from '@services/message.service';
import { ScrollService } from '@services/scroll.service';
import { of } from 'rxjs';
import { catchError, filter, first, switchMap, takeUntil, tap } from 'rxjs/operators';
import { IngredientService } from 'src/app/pages/ingredients/ingredient.service';

@Component({
    selector: 'app-ingredient-edit',
    templateUrl: './ingredient-edit.component.html',
    styleUrls: ['./ingredient-edit.component.scss'],
    standalone: false
})
// done saving after adding a subDocument - re-write api to pick this up
// done deleting subDocuments with ID's - can the api also pick this up on save?
// TODO: Warning on leaving screen with edited items
// done: Add in nutrition editor
// done: Add in the recipes this is used in with links
// TODO: Price Calculation
// TODO: confirm warning header not working?
// done: Add caloricBreakdown editor
// done: Add matched item id for spoontacular
// TODO: do something with matched item
// TODO: Search / filter is triggering the spinny wheel and shouldn't
// TODO add a match ingredient to USDA method to ingredients page
// use flatMap - https://medium.com/swlh/cant-tell-your-flatmaps-from-your-switchmaps-a1f0f497b61a

// Behaviour - edited fields either update or add to array of editedItem, on save this array is then iterated to create
// the IngredientModel for new or sent through to update
export class IngredientEditComponent extends ComponentBase implements OnInit {
  @Input() singleIngredient!: IIngredient;
  @Input() isNew = false;
  @Input() refData!: IReferenceAll;
  @Input() measurements: IMeasurement[] = [];
  @Output() deleteItem = new EventEmitter<IIngredient>();
  @Output() back = new EventEmitter<void>();

  @ViewChild('constanceId', { static: true }) constanceSelect!: MatSelect;

  selected: IIngredient | null = null;
  ingredientForm: UntypedFormGroup = new UntypedFormGroup({});
  // priceForm: FormGroup;
  // conversionsForm: FormGroup;
  editedItem: IEditedField[] = [];
  validationMessages = ValidationMessages;

  // getFormKeys = (controls: FormGroup): string[] => { return Object.keys(controls); }

  // measurementTypes = this.measurements.reduce((types, item) => {
  // 	if (types.includes(item.type)) {
  // 		return types;
  // 	}
  // 	return [...types, item.type];
  // }, []);
  // ingredientState = IngredientState;
  // allergyArray = AllergyArray;
  // parentType = ParentTypes;
  lastChecked: any = {};
  isSavingResults = false;

  constructor(
    private fb: UntypedFormBuilder,
    private ingredientService: IngredientService,
    private dialogService: DialogService,
    private messageService: MessageService,
    private ingredientEditFormService: IngredientEditFormService,
    private scrollService: ScrollService
  ) {
    super();
  }

  ngOnInit() {
    this.selected = this.singleIngredient;
    this.ingredientForm = this.ingredientEditFormService.createForm(this.singleIngredient, this.isNew);
    console.log('raw ingredient form', this.ingredientForm.getRawValue(), this.refData);
    this.scrollService
      .getScrollPosition()
      .pipe(
        tap((scrollPos: IScrollPositions) => console.log('listening to scroll', scrollPos)),
        takeUntil(this.ngUnsubscribe)
      )
      .subscribe();
  }

  get foodGroup(): UntypedFormControl {
    return this.ingredientForm.get('foodGroup') as UntypedFormControl;
  }
  get allergiesControl(): UntypedFormControl {
    return this.ingredientForm.get('allergies') as UntypedFormControl;
  }
  get purchasedByControl(): UntypedFormControl {
    return this.ingredientForm.get('purchasedBy') as UntypedFormControl;
  }
  get linkUrl(): UntypedFormControl {
    return this.ingredientForm.get('linkUrl') as UntypedFormControl;
  }
  get price(): UntypedFormArray {
    return this.ingredientForm.get('price') as UntypedFormArray;
  }
  get ingredientConversions(): UntypedFormArray {
    return this.ingredientForm.get('ingredientConversions') as UntypedFormArray;
  }
  get nutrition(): UntypedFormArray {
    return this.ingredientForm.get('nutrition') as UntypedFormArray;
  }
  get caloricBreakdown(): UntypedFormGroup {
    return this.ingredientForm.get('caloricBreakdown') as UntypedFormGroup;
  }
  get nutritionFacts(): UntypedFormGroup {
    return this.ingredientForm.get('nutritionFacts') as UntypedFormGroup;
  }
  get commonVitamins(): UntypedFormGroup {
    return this.ingredientForm.get('commonVitamins') as UntypedFormGroup;
  }
  get commonMinerals(): UntypedFormGroup {
    return this.ingredientForm.get('commonMinerals') as UntypedFormGroup;
  }

  getFormGroupOfArray(fArray: UntypedFormArray, index: number): UntypedFormGroup {
    return fArray.at(index) as UntypedFormGroup;
  }

  markFormClean(): void {
    this.ingredientForm.markAsUntouched();
    this.ingredientForm.markAsPristine();
  }

  onSaveItem(): void {
    if (!this.selected) {
      return;
    }

    const findReference = (id: number, refKey: keyof IReferenceAll) =>
      this.refData[refKey]?.find((item: IReferenceItemFull) => item.id === id);
    const findMeasurement = (id: number) => this.measurements.find((item: IMeasurement) => item.id === id);

    this.isSavingResults = true;
    const formRaw = this.ingredientForm.getRawValue();
    const saveObject: IIngredient = {
      id: this.selected.id,
      ...formRaw
    };
    saveObject.allergies = formRaw.allergies.map((id: number) => findReference(id, 'AllergyWarning'));
    // saveObject.foodGroup = findReference(formRaw.foodGroup, 'IngredientFoodGroup');
    // saveObject.ingredientConversions = saveObject.ingredientConversions?.map((convert: Conversion) => {
    //   return {
    //     ...convert,
    //     baseMeasurementUnit: findMeasurement(Number(convert.baseMeasurementUnit)),
    //     baseState: findReference(Number(convert.baseState), 'IngredientState'),
    //     convertToMeasurementUnit: findMeasurement(Number(convert.convertToMeasurementUnit)),
    //     convertToState: findReference(Number(convert.convertToState), 'IngredientState')
    //   };
    // });
    console.log('ingredient form', this.ingredientForm.getRawValue(), this.selected, saveObject);
    // getRawValue evaluates arrays as null if the array is empty
    if (!saveObject.allergies) {
      saveObject.allergies = [];
    }
    const ingredientAPI$ = this.isNew
      ? this.ingredientService.createIngredient(saveObject)
      : this.ingredientService.updateIngredient(this.selected.id as number, saveObject);
    ingredientAPI$
      .pipe(
        tap((item: IIngredient) => {
          this.messageService.add({
            severity: MessageStatus.Success,
            summary: 'Save Successful'
          });
          this.markFormClean();
          if (this.isNew) {
            this.selected = item;
            this.ingredientForm = this.ingredientEditFormService.createForm(item, true);
            this.isNew = false;
          }
        }),
        catchError((error: unknown) => {
          const err = error as HttpErrorResponse;
          this.dialogService.confirm(MessageStatus.Warning, 'Error Saving ingredient', err.message);
          return of({} as IIngredient);
        }),
        takeUntil(this.ngUnsubscribe)
      )
      .subscribe(() => (this.isSavingResults = false));
  }

  refreshData() {
    console.log('get data online');
    this.ingredientService
      .getSpoonacularIngredient(this.linkUrl.value)
      .pipe(
        tap((returnItem) => console.log('not sure what to do yet', returnItem)),
        takeUntil(this.ngUnsubscribe)
      )
      .subscribe();
  }

  // Seems like it was trying to remove a formGroup from a formArray - but needs to pass in the array really.
  deleteSubDocument(subDocument: string, docSubId: string, controlIndex: number) {
    // only deletes on save - just removes it from the formControls
    // this[subDocument].removeAt(controlIndex);
    // this[subDocument].markAsDirty();
    // this[subDocument].markAsTouched();
    this.messageService.add({
      severity: MessageStatus.Success,
      summary: `Removed ${subDocument}`,
      life: 8000
    });
  }

  /**
   * Triggered by the output event of app-edit-ingredient-basic
   * Recreates the form - possibly should write a service to patch the form instead...
   * @param ev event containing updated Ingredient from the dialog-ingredient-match
   */
  updateIngredient(ev: IIngredient): void {
    this.ingredientForm = this.ingredientEditFormService.createForm(ev, this.isNew);
    this.ingredientForm.markAsDirty();
  }

  addSubDocument(subDocument: string): void {
    // expected either prices, conversions, or nutrition
    // add a new subDoc to this.selected[subDocument] with an empty model, then create a set of controls based on that
    // switch (subDocument) {
    // 	case 'conversions': this.ingredientConversions.push(
    // this.ingredientEditFormService.initConversionFormGroup(new ConversionModel(), true)
    // );
    // 		break;
    // 	// case 'nutrition': this.nutrition.push(this.initNutritionFormGroup(new NutritionModel(), true)); break;
    // 	default: this.messageService.add({severity: MessageStatus.Warning, summary: `Unidentified subDocument created, ${subDocument}`})
    // }
    // this[subDocument].markAsDirty();
    // this[subDocument].markAsTouched();
  }

  // createSubDocument(ingredientId: string, subDocumentName: string, subDocument: Price | Conversion) {
  // 	this.ingredientService.createSubDocument('ingredient', ingredientId, subDocumentName, subDocument).pipe(
  // 		tap((newSubIngredient: Ingredient) => {
  // 			// this.dataTableComponent.modifyIngredient(newSubIngredient, 'edit');
  // 		}),
  // 		catchError(err => {
  // 			console.log('Error', err);
  // 			this.dialogService.confirm(MessageStatus.Critical, err.name, err);
  // 			return of([]);
  // 		}),
  // 		takeUntil(this.ngUnsubscribe),
  // 	).subscribe();
  // }

  deleteIngredient(): void {
    if (!this.selected) {
      return;
    }

    this.dialogService
      .confirm(
        MessageStatus.Warning,
        'Delete Ingredient',
        `Are you sure you want to delete the ingredient ${this.selected.name}?`,
        'Delete'
      )
      .pipe(
        first(),
        filter((result: boolean) => !!result),
        switchMap(() => this.ingredientService.deleteItem(this.selected?.id as number)),
        tap((deletedIngredient: IIngredient) => {
          console.log('Deleted Ingredient', deletedIngredient);
          // is there anyway to make this refresh the list?
          this.back.emit();
        })
      )
      .subscribe();
  }

  dragNDrop(event: any): void {
    // let min = event.currentIndex;
    // let max = event.previousIndex;
    // let reverse = false;
    // if (event.previousIndex < event.currentIndex) {
    // 	min = event.previousIndex;
    // 	max = event.currentIndex;
    // 	reverse = true;
    // }
    // // quick check to ensure numbers will be in range
    // if (min >= 0 && max < this.selected.ingredientConversions.length) {
    // 	// todo there has to be a better way of doing this!
    // 	for (let i = min; i <= max; i++) {
    // 		reverse ? this.selected.ingredientConversions[i].preference-- : this.selected.ingredientConversions[i].preference++;
    // 		// check for repeats and add items to editedItem
    // 		// todo  maybe instead on submit check through the preferences against the original - create change event for each actual change?
    // 	}
    // 	this.selected.ingredientConversions[event.previousIndex].preference = event.currentIndex;
    // }
    // this.selected.ingredientConversions = [...this.selected.ingredientConversions].sort(DateTimeService.sortByNumber);
  }
}
