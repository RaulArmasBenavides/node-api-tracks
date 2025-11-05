export type Role = "USER_ROLE" | "ADMIN_ROLE";

export interface MenuItem {
  titulo: string;
  icono: string;
  submenu: Array<{ titulo: string; url: string }>;
}

/**
 * Genera el menú del frontend según el rol del usuario.
 */
export function getMenuFrontEnd(role: Role = "USER_ROLE"): MenuItem[] {
  const menu: MenuItem[] = [
    {
      titulo: "Dashboard",
      icono: "mdi mdi-gauge",
      submenu: [
        { titulo: "Main", url: "/" },
        { titulo: "Gráficas", url: "grafica1" },
        { titulo: "rxjs", url: "rxjs" },
        { titulo: "Promesas", url: "promesas" },
        { titulo: "ProgressBar", url: "progress" },
      ],
    },
    {
      titulo: "Mantenimientos",
      icono: "mdi mdi-folder-lock-open",
      submenu: [
        // { titulo: 'Usuarios', url: 'usuarios' },
        { titulo: "Hospitales", url: "hospitales" },
        { titulo: "Médicos", url: "medicos" },
        { titulo: "Centros de Vacunación", url: "centros" }
      ],
    },
    {
      titulo: "Dotación",
      icono: "mdi mdi-folder-lock-open",
      submenu: [
        { titulo: "Personal", url: "personal" },
        { titulo: "Tiendas", url: "tiendas" },
        { titulo: "Requerimientos", url: "requerimientos" },
        { titulo: "Control", url: "control" },
      ],
    },
    {
      titulo: "Asistencias",
      icono: "mdi mdi-folder-lock-open",
      submenu: [
        { titulo: "Marcas", url: "personal" },
        { titulo: "Asistencias", url: "tiendas" },
        { titulo: "Reporte de Asistencias", url: "requerimientos" },
      ],
    },
  ];

  if (role === "ADMIN_ROLE") {
    menu[1].submenu.unshift({ titulo: "Usuarios", url: "usuarios" });
  }

  return menu;
}

export default { getMenuFrontEnd };
