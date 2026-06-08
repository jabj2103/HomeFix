import "./PrivacyPolicy.css";

function PrivacyPolicy() {
  return (
    <main className="privacy-page">
      <section className="privacy-hero">
        <p>HomeFix</p>
        <h1>Política de privacidad</h1>
        <span>
          Tratamiento de datos personales conforme a la Ley 1581 de 2012 de
          Colombia y sus normas reglamentarias.
        </span>
      </section>

      <section className="privacy-content">
        <article>
          <h2>Tratamiento de datos personales</h2>
          <p>
            HomeFix recolecta y trata datos personales entregados por los
            usuarios al registrarse, comprar productos, solicitar servicios,
            comunicarse con la empresa o navegar por la plataforma. Estos datos
            pueden incluir nombre, correo electrónico, teléfono, dirección,
            información de solicitudes de servicio, historial de compras y datos
            técnicos necesarios para operar el sitio.
          </p>
        </article>

        <article>
          <h2>Finalidad del uso de la información</h2>
          <p>
            La información se utiliza para gestionar pedidos, coordinar
            servicios, responder solicitudes, brindar soporte, enviar
            notificaciones relacionadas con la operación, mejorar la experiencia
            del usuario, cumplir obligaciones legales y prevenir fraude o usos
            indebidos de la plataforma.
          </p>
        </article>

        <article>
          <h2>Protección de datos</h2>
          <p>
            HomeFix adopta medidas administrativas, técnicas y organizacionales
            razonables para proteger los datos personales contra acceso no
            autorizado, pérdida, alteración, divulgación o uso indebido. El
            acceso a la información se limita a quienes lo necesitan para
            cumplir las finalidades autorizadas.
          </p>
        </article>

        <article>
          <h2>Derechos de los usuarios</h2>
          <p>
            Conforme a la Ley 1581 de 2012, los titulares pueden conocer,
            actualizar, rectificar y solicitar la supresión de sus datos
            personales, revocar la autorización otorgada, solicitar prueba de la
            autorización, ser informados sobre el uso de sus datos y presentar
            quejas ante la Superintendencia de Industria y Comercio cuando
            corresponda.
          </p>
        </article>

        <article>
          <h2>Uso de cookies</h2>
          <p>
            HomeFix puede usar cookies o tecnologías similares para recordar
            preferencias, mantener sesiones, analizar el funcionamiento del
            sitio y mejorar la navegación. El usuario puede configurar su
            navegador para bloquear o eliminar cookies, entendiendo que algunas
            funciones podrían verse afectadas.
          </p>
        </article>

        <article>
          <h2>Contacto para solicitudes</h2>
          <p>
            Las consultas, reclamos o solicitudes relacionadas con datos
            personales pueden enviarse al correo
            <a href="mailto:privacidad@homefix.com"> privacidad@homefix.com</a>.
            HomeFix atenderá estas solicitudes de acuerdo con los plazos y
            procedimientos establecidos por la normativa colombiana aplicable.
          </p>
        </article>
      </section>
    </main>
  );
}

export default PrivacyPolicy;
