package com.globaltech.pessoas.validation;

public final class CpfUtils {

    private CpfUtils() {
    }

    public static String digitsOnly(String value) {
        if (value == null) {
            return "";
        }

        return value.replaceAll("\\D", "");
    }

    public static boolean isValid(String value) {
        String cpf = digitsOnly(value);

        if (cpf.length() != 11 || cpf.chars().distinct().count() == 1) {
            return false;
        }

        return checkDigit(cpf, 9) == Character.getNumericValue(cpf.charAt(9))
                && checkDigit(cpf, 10) == Character.getNumericValue(cpf.charAt(10));
    }

    private static int checkDigit(String cpf, int length) {
        int sum = 0;

        for (int i = 0; i < length; i++) {
            sum += Character.getNumericValue(cpf.charAt(i)) * (length + 1 - i);
        }

        int remainder = (sum * 10) % 11;
        return remainder == 10 ? 0 : remainder;
    }
}
