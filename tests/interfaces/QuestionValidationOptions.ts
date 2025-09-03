interface QuestionValidationOptions<T> {
  invalidValues?: T[];           
  errorMessage?: string;       
  errorClass?: new (msg: string) => Error; 
}
