import * as yup from 'yup';

export const yupValidators = {
  notEmpty: yup.string().required('Le champ doit être complété'),
  min2chars: yup
    .string()
    .min(2, 'Doit comporter au moins 2 caractères')
    .required('Le champ doit être complété'),
  email: yup
    .string()
    .email("Le courriel n'est pas valide")
    .required("L'adresse électronique est obligatoire"),
  password: yup
    .string()
    .min(5, 'Le mot de passe doit comporter au moins 5 caractères')
    .matches(/^.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?].*$/, "Besoin d'un caractère spécial")
    .matches(/^.*[A-Z].*$/, "Besoin d'une lettre majuscule minimum")
    .matches(/^.*[a-z].*$/, "Besoin d'une lettre minuscule minimum")
    .matches(/^.*[0-9].*$/, "Besoin d'un chiffre minimum")
    .matches(/^\S+$/, "Aucun espace n'est autorisé")
    .required('Le champ doit être complété'),
  confirm_password: yup
    .string()
    .oneOf([yup.ref('password'), null], 'Les mots de passe doivent correspondre')
    .required('La répétition du mot de passe est nécessaire'),
  phoneNo: yup.string().matches(/^[\+\d]?(?:[\d-.\s()]*)$/, 'Seuls les chiffres sont autorisés'),
};

const notEmpty = (val) => {
  if (!val) {
    return "Field can't be empty";
  }
};

export const validators = {
  name: (val) => {
    const empty = notEmpty(val);
    return empty && [empty];
  },
  description: (val) => {
    const empty = notEmpty(val);
    return empty && [empty];
  },
};

export default function (fields = []) {
  const errors = {};
  fields?.forEach((field) => {
    const { fieldName, value } = field;
    const validator = validators[fieldName];
    const fieldErrors = validator && validator(value);
    if (fieldErrors) {
      errors[fieldName] = fieldErrors;
    }
  });
  console.log({ fields, errors });
  return errors;
}
