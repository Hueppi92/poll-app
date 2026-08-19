import { Pipe, PipeTransform } from '@angular/core';

export type NumerationStyle = 'numeric' | 'alpha';

// Formats a 0-based index as "1." (numeric) or "A." (alpha) numeration.
@Pipe({
  name: 'numeration',
})
export class NumerationPipe implements PipeTransform {
  transform(index: number, style: NumerationStyle = 'numeric'): string {
    if (style === 'alpha') {
      return `${String.fromCharCode(65 + index)}.`;
    }
    return `${index + 1}.`;
  }
}
