// This file will make the translation keys type-safe

type Messages = typeof import("@/translations/en.json");
declare interface IntlMessages extends Messages {}