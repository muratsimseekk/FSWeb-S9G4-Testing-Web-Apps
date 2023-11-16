import React from "react";
import {
  fireEvent,
  getByTestId,
  render,
  screen,
  waitFor,
} from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import userEvent from "@testing-library/user-event";
import IletisimFormu from "./IletisimFormu";

test("hata olmadan render ediliyor", () => {
  render(<IletisimFormu />);
});

test("iletişim formu headerı render ediliyor", () => {
  render(<IletisimFormu />);
  const header = screen.getByText(/İletişim Formu/i);

  expect(header).toBeInTheDocument();
});

test("kullanıcı adını 5 karakterden az girdiğinde BİR hata mesajı render ediyor.", async () => {
  render(<IletisimFormu />);

  const adInput = screen.getByTestId(/ad/i);

  userEvent.type(adInput, "hata");

  const hataMesaji = await screen.getByText(/ad en az 5 karakter olmalıdır./i);
  expect(hataMesaji).toBeInTheDocument();
});

test("kullanıcı inputları doldurmadığında ÜÇ hata mesajı render ediliyor.", async () => {
  render(<IletisimFormu />);
  const isimInput = screen.getByTestId(/ad/i);
  const soyisimInput = screen.getByTestId(/soyisim/i);
  const emailInput = screen.getByTestId(/email/i);
  const gonderButton = screen.getByTestId(/gonder/i);

  userEvent.type(isimInput, "");
  userEvent.type(soyisimInput, "");
  userEvent.type(emailInput, "");

  userEvent.click(gonderButton);

  const hataMesaji = screen.getAllByText(/Hata/i);

  expect(hataMesaji).toHaveLength(3);
});

test("kullanıcı doğru ad ve soyad girdiğinde ama email girmediğinde BİR hata mesajı render ediliyor.", async () => {
  render(<IletisimFormu />);
  const isim = screen.getByTestId(/ad/i);
  const soyIsim = screen.getByTestId(/soyisim/i);
  const emailInput = screen.getByTestId(/email/i);
  const gonderBtn = screen.getByTestId(/gonder/i);

  userEvent.type(isim, "Ilhan");
  userEvent.type(soyIsim, "Mansiz");
  userEvent.type(emailInput, "");

  userEvent.click(gonderBtn);

  const hataMesaji = screen.getByText(/email adresi ./i);

  expect(hataMesaji).toBeInTheDocument();
});

test('geçersiz bir mail girildiğinde "email geçerli bir email adresi olmalıdır." hata mesajı render ediliyor', async () => {
  render(<IletisimFormu />);

  const mailTest = screen.getByTestId(/email/i);

  userEvent.type(mailTest, "ilhanmansizmailadres");

  userEvent.click(screen.getByTestId(/gonder/i));

  expect(
    screen.getByText(/email geçerli bir email adresi olmalıdır./i)
  ).toBeInTheDocument();
});

test('soyad girilmeden gönderilirse "soyad gereklidir." mesajı render ediliyor', async () => {
  render(<IletisimFormu />);

  userEvent.type(screen.getByTestId(/ad/i), "MuratSimsek");
  userEvent.type(screen.getByTestId(/soyisim/i), "");
  userEvent.type(screen.getByTestId(/email/i, "ilhanmansiz@gmail.com"));

  userEvent.click(screen.getByTestId(/gonder/i));

  expect(screen.getByText(/soyad gereklidir./i)).toBeInTheDocument();
});

test("ad,soyad, email render ediliyor. mesaj bölümü doldurulmadığında hata mesajı render edilmiyor.", async () => {
  render(<IletisimFormu />);

  userEvent.type(screen.getByTestId(/mesaj/i), "");

  userEvent.click(screen.getByTestId(/gonder/i));

  expect(screen.queryByText(/mesaj bolumu/i)).not.toBeInTheDocument();
});

test("form gönderildiğinde girilen tüm değerler render ediliyor.", async () => {
  render(<IletisimFormu />);
  userEvent.type(screen.getByTestId(/ad/i), "Ilhan");
  userEvent.type(screen.getByTestId(/soyisim/i), "Mansiz");
  userEvent.type(screen.getByTestId(/email/i), "ilhanmansiz@gmail.com");
  userEvent.type(screen.getByTestId(/mesaj/i), "Merhaba");

  userEvent.click(screen.getByTestId(/gonder/i));

  expect(screen.queryAllByText(/hata/i)).toHaveLength(0);
});
