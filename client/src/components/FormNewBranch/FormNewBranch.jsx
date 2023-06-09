import { useFormik } from "formik";
import { useSession } from "next-auth/react";
import { useState } from "react";
import axios from "axios";
import { BsCheckSquare } from "react-icons/bs";
import Modal from "@/commons/Modal";
import validationNewBranch from "./validation/validationNewBranch";
import { useRouter } from "next/router";
import { DateTime } from "luxon";

export default function FormNewBranch() {
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [notHour, setNotHour] = useState("");
  const { data } = useSession();
  const router = useRouter();

  function intervalosMediaHora(horaInicio, horaFin) {
    const diff = DateTime.fromFormat(horaFin, "HH:mm").diff(
      DateTime.fromFormat(horaInicio, "HH:mm"),
      "minutes"
    );
    const numIntervalos = Math.ceil(diff.minutes / 30) + 1;
    const intervalos = [...Array(numIntervalos)].map((_, i) => {
      const fecha = DateTime.fromFormat(horaInicio, "HH:mm").plus({
        minutes: i * 30,
      });
      return fecha.toLocaleString({
        hour: "2-digit",
        minute: "2-digit",
        hourCycle: "h23",
      });
    });

    return intervalos;
  }

  const horaInicio = "07:00";
  const horaFin = "23:00";

  const intervalos = intervalosMediaHora(horaInicio, horaFin);

  const formik = useFormik({
    initialValues: {
      name: "",
      location: "",
      closingHour: "",
      openingHour: "",
      allowedClients: "",
    },

    onSubmit: async (dat) => {
      const { name, location, closingHour, openingHour, allowedClients } = dat;
      const openingTime = DateTime.fromFormat(openingHour, "HH:mm");
      const closingTime = DateTime.fromFormat(closingHour, "HH:mm");
      const hoursOpen = closingTime.diff(openingTime, "hours").hours;

      if (hoursOpen < 0) {
        setNotHour("Horarios incorrectos");
        setTimeout(() => {
          setNotHour("");
        }, 2000);
        return null;
      }

      const response = await axios.post(
        `https://line-up-back.onrender.com/api/admin/create-branch/token?token=${data.user}`,
        { name, location, closingHour, openingHour, allowedClients },
        { withCredentials: true, credentials: "include" }
      );
      setModalIsOpen(true);
    },
    validationSchema: validationNewBranch.validationSchema,
  });

  return (
    <>
      <div className="container-form-userdata">
        <div className="container-form-userdata-first-div">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              formik.handleSubmit();
            }}
            className="login-form"
            style={{ marginTop: "5px" }}
          >
            <div className="login-form_box-title">
              <h2>Crear una nueva sucursal</h2>
            </div>
            <div className="login-form_box-input">
              <label htmlFor="name" style={{ marginTop: "5px" }}>
                Nombre
              </label>
              <input
                className={`input-primary width-100 ${
                  formik.touched.name && formik.errors.name ? "error-input" : ""
                }`}
                type="text"
                id="name"
                onChange={formik.handleChange}
                value={formik.values.name}
              />
              <div className="box-span"></div>
            </div>
            <div className="login-form_box-input">
              <label htmlFor="location">Ubicacion</label>
              <input
                className={`input-primary width-100 ${
                  formik.touched.location && formik.errors.location
                    ? "error-input"
                    : ""
                }`}
                type="text"
                id="location"
                onChange={formik.handleChange}
                value={formik.values.location}
              />
            </div>
            <div className="div-split-two">
              <div className="div-inter-50-left">
                <label htmlFor="openingHour">Horario de incio</label>
                <select
                  className={`input-primary width-100 ${
                    formik.touched.openingHour && formik.errors.openingHour
                      ? "error-input"
                      : ""
                  }`}
                  type="text"
                  id="openingHour"
                  onChange={formik.handleChange}
                  value={formik.values.openingHour}
                >
                  {intervalos.map((int, idx) => {
                    return <option key={idx}>{int}</option>;
                  })}
                </select>
                <div className="box-not-hour">
                  <span>{notHour}</span>
                </div>
              </div>
              <div className="div-inter-50-right">
                <label htmlFor="closingHour">Horario de cierre</label>
                <select
                  className={`input-primary width-100  ${
                    formik.touched.closingHour && formik.errors.closingHour
                      ? "error-input"
                      : ""
                  }`}
                  type="text"
                  id="closingHour"
                  onChange={formik.handleChange}
                  value={formik.values.closingHour}
                >
                  {intervalos.map((int, idx) => {
                    return <option key={idx}>{int}</option>;
                  })}
                </select>
              </div>
            </div>
            <div className="login-form_box-input">
              <label htmlFor="allowedClients">Capacidad maxima</label>
              <input
                className={`input-primary width-100 ${
                  formik.touched.allowedClients && formik.errors.allowedClients
                    ? "error-input"
                    : ""
                }`}
                type="number"
                id="allowedClients"
                onChange={formik.handleChange}
                value={formik.values.allowedClients}
              />
            </div>
            <div>
              <button
                className="btn-primary width-100"
                type="submit"
                style={{ marginTop: "15px" }}
              >
                Aceptar
              </button>
            </div>
          </form>
        </div>
      </div>
      <Modal
        modalIsOpen={modalIsOpen}
        setModalIsOpen={setModalIsOpen}
        redirect={{ function: router.push, rute: "/crearOperador" }}
        modalContent={{
          title: "Sucursal creada correctamente",
          description: "Ya podes designar un operador a esta sucursal",
          button: "Aceptar",
          icon: <BsCheckSquare className="icon" />,
        }}
      ></Modal>
    </>
  );
}
