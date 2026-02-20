import {
  Check,
  ChevronsUpDown,
  ArrowLeft,
  Save,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Command, CommandEmpty, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import type { CitySlaFormState, MasterDataCity } from '@/features/master-city-sla/model/types';

type MasterCitySlaFormPanelProps = {
  form: CitySlaFormState;
  selectableCities: MasterDataCity[];
  selectedCityLabel: string;
  cityAutocompleteOpen: boolean;
  editingUuid: string | null;
  loadingCity: boolean;
  submitting: boolean;
  onFormChange: (next: CitySlaFormState) => void;
  onCityAutocompleteOpenChange: (open: boolean) => void;
  onSubmit: () => void;
  onBack: () => void;
};

export function MasterCitySlaFormPanel({
  form,
  selectableCities,
  selectedCityLabel,
  cityAutocompleteOpen,
  editingUuid,
  loadingCity,
  submitting,
  onFormChange,
  onCityAutocompleteOpenChange,
  onSubmit,
  onBack,
}: MasterCitySlaFormPanelProps) {
  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        onSubmit();
      }}
      className="rounded-lg border p-5"
    >
      <h3 className="mb-4 text-base font-semibold">{editingUuid ? 'Edit City SLA' : 'Add City SLA'}</h3>
      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2 md:col-span-2">
          <Label>City</Label>
          <Popover open={cityAutocompleteOpen} onOpenChange={onCityAutocompleteOpenChange}>
            <PopoverTrigger asChild>
              <Button
                type="button"
                variant="outline"
                role="combobox"
                aria-expanded={cityAutocompleteOpen}
                className="h-10 w-full justify-between font-normal"
                disabled={selectableCities.length === 0}
              >
                {selectedCityLabel || 'Select city'}
                <ChevronsUpDown className="ml-2 size-4 shrink-0 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0" align="start">
              <Command>
                <CommandInput placeholder="Search city..." />
                <CommandList>
                  <CommandEmpty>No city found.</CommandEmpty>
                  {selectableCities.map((city) => {
                    const optionLabel = `${city.name} (${city.postalCode})${city.province ? ` - ${city.province.name}` : ''}`;
                    return (
                      <CommandItem
                        key={city.uuid}
                        value={optionLabel}
                        onSelect={() => {
                          onFormChange({ ...form, cityId: city.uuid });
                          onCityAutocompleteOpenChange(false);
                        }}
                      >
                        <Check className={`mr-2 size-4 ${form.cityId === city.uuid ? 'opacity-100' : 'opacity-0'}`} />
                        {optionLabel}
                      </CommandItem>
                    );
                  })}
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
          {!editingUuid && selectableCities.length === 0 ? (
            <p className="text-xs text-muted-foreground">No available city. All cities already have City SLA.</p>
          ) : null}
        </div>

        <div className="space-y-2">
          <Label>Std Lead Time (Days)</Label>
          <Input
            type="number"
            min={0}
            value={form.stdLeadTimeDays}
            onChange={(e) => onFormChange({ ...form, stdLeadTimeDays: e.target.value })}
            required
          />
        </div>

        <div className="space-y-2">
          <Label>Std Return DO (Days)</Label>
          <Input
            type="number"
            min={0}
            value={form.stdReturnDoDays}
            onChange={(e) => onFormChange({ ...form, stdReturnDoDays: e.target.value })}
            required
          />
        </div>
      </div>

      <div className="mt-6 flex items-center justify-end gap-2">
        <Button type="button" variant="outline" onClick={onBack}>
          <ArrowLeft />
          Cancel
        </Button>
        <Button type="submit" disabled={submitting || loadingCity}>
          <Save />
          {submitting ? 'Saving...' : editingUuid ? 'Update City SLA' : 'Create City SLA'}
        </Button>
      </div>
    </form>
  );
}
