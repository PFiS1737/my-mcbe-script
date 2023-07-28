export class WrapperTemplate {
   static wrap(...args) {
       return new this(...args)
   }
   static tryWrap(...args) {
       try {
           return new this(...args)
       } catch(err) {}
   }
}
