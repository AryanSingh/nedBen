import { Pipe, PipeTransform } from '@angular/core';

@Pipe({name: 'proper'})
export class proper implements PipeTransform {
  transform(inputTxt){
    return inputTxt.charAt(0).toUpperCase() + inputTxt.substr(1).toLowerCase();
  }
}

@Pipe({name: 'htmlToPlaintext'})
export class htmlToPlainText implements PipeTransform {
  transform(text){
 	return  text ? String(text).replace(/<[^>]+>/gm, '') : '';
  }
}

@Pipe({name: 'nlRemove'})
export class nlRemove implements PipeTransform {
  transform(text){
 	return text ? text.replace(/\n/g, ' ') : '';
  }
}

