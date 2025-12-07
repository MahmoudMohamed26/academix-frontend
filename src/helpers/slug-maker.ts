export default function SlugMaker(title: string){
  return title.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '');
}