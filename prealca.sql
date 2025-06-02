-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 15-05-2025 a las 11:24:13
-- Versión del servidor: 10.4.32-MariaDB
-- Versión de PHP: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `prealca`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `camiones`
--

CREATE TABLE `camiones` (
  `id` int(11) NOT NULL,
  `marca` varchar(50) NOT NULL,
  `modelo` varchar(50) NOT NULL,
  `placa` varchar(20) NOT NULL,
  `capacidad` decimal(10,2) NOT NULL,
  `foto` varchar(255) DEFAULT NULL,
  `estado` enum('activo','mantenimiento','inactivo') DEFAULT 'activo',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `camiones`
--

INSERT INTO `camiones` (`id`, `marca`, `modelo`, `placa`, `capacidad`, `foto`, `estado`, `created_at`) VALUES
(1, 'Ford', 'F-350', 'ABC-123', 8.50, NULL, 'activo', '2025-04-26 00:20:05'),
(2, 'Chevrolet', 'NPR', 'XYZ-789', 10.00, NULL, 'activo', '2025-04-26 00:20:05'),
(3, 'Iveco', 'Daily', 'DEF-456', 7.50, NULL, 'activo', '2025-04-26 00:20:05');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `choferes`
--

CREATE TABLE `choferes` (
  `id` int(11) NOT NULL,
  `nombre` varchar(100) NOT NULL,
  `cedula` varchar(20) NOT NULL,
  `licencia` varchar(50) NOT NULL,
  `vencimiento_licencia` date NOT NULL,
  `certificado_medico` varchar(50) DEFAULT NULL,
  `vencimiento_certificado` date DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `choferes`
--

INSERT INTO `choferes` (`id`, `nombre`, `cedula`, `licencia`, `vencimiento_licencia`, `certificado_medico`, `vencimiento_certificado`, `created_at`) VALUES
(1, 'Juan Pérez', 'V-12345678', 'L-12345', '2023-12-31', 'CM-12345', '2023-12-31', '2025-04-26 00:20:05'),
(2, 'Carlos Rodríguez', 'V-23456789', 'L-23456', '2024-06-30', 'CM-23456', '2024-06-30', '2025-04-26 00:20:05'),
(3, 'Miguel González', 'V-34567890', 'L-34567', '2024-03-31', 'CM-34567', '2024-03-31', '2025-04-26 00:20:05');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `clientes`
--

CREATE TABLE `clientes` (
  `id` int(11) NOT NULL,
  `nombre` varchar(100) NOT NULL,
  `direccion` text NOT NULL,
  `telefono` varchar(20) NOT NULL,
  `documento` varchar(20) NOT NULL,
  `vendedor_id` int(11) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `clientes`
--

INSERT INTO `clientes` (`id`, `nombre`, `direccion`, `telefono`, `documento`, `vendedor_id`, `created_at`) VALUES
(1, 'Constructora ABC', 'Av. Principal #123', '0412-1234567', 'J-12345678-9', 1, '2025-04-26 00:20:05'),
(2, 'Edificaciones XYZ', 'Calle 45 #67-89', '0414-2345678', 'J-23456789-0', 2, '2025-04-26 00:20:05'),
(3, 'Inmobiliaria Delta', 'Carrera 12 #34-56', '0416-3456789', 'J-34567890-1', 3, '2025-04-26 00:20:05'),
(4, 'Franco Fusco', 'Av Bolivar Maracay', '04122928716', '30090650', 1, '2025-04-26 18:12:49'),
(5, 'Pepito ', 'Av Fuerza Area, Urb Nuevo Bosque Alto', '04243504866', '29345831', 2, '2025-04-26 18:57:13');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `despachos`
--

CREATE TABLE `despachos` (
  `id` int(11) NOT NULL,
  `fecha` date NOT NULL,
  `guia` varchar(50) NOT NULL,
  `m3` decimal(10,2) NOT NULL,
  `resistencia` varchar(20) NOT NULL,
  `cliente_id` int(11) NOT NULL,
  `chofer_id` int(11) NOT NULL,
  `vendedor_id` int(11) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `despachos`
--

INSERT INTO `despachos` (`id`, `fecha`, `guia`, `m3`, `resistencia`, `cliente_id`, `chofer_id`, `vendedor_id`, `created_at`) VALUES
(1, '2003-10-09', '129034', 10.00, '250', 1, 1, 2, '2025-04-26 18:12:17'),
(4, '2011-11-11', '129035', 10.00, '210', 2, 1, 3, '2025-04-27 00:54:37'),
(5, '2022-02-22', '129037', 12.00, '280', 3, 2, 3, '2025-04-27 00:56:44');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `inventario`
--

CREATE TABLE `inventario` (
  `id` int(11) NOT NULL,
  `nombre` varchar(100) NOT NULL,
  `cantidad` decimal(10,2) NOT NULL,
  `unidad` varchar(20) NOT NULL,
  `minimo` decimal(10,2) NOT NULL,
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `inventario`
--

INSERT INTO `inventario` (`id`, `nombre`, `cantidad`, `unidad`, `minimo`, `updated_at`, `created_at`) VALUES
(1, 'Cemento', 150.00, 'Sacos', 50.00, '2025-04-26 00:20:05', '2025-04-26 00:20:05'),
(2, 'Arena', 80.00, 'm³', 30.00, '2025-04-26 00:20:05', '2025-04-26 00:20:05'),
(3, 'Grava', 65.00, 'm³', 25.00, '2025-04-26 00:20:05', '2025-04-26 00:20:05'),
(4, 'Aditivo', 20.00, 'Galones', 10.00, '2025-04-26 00:20:05', '2025-04-26 00:20:05'),
(5, 'Acero', 200.00, 'Varillas', 50.00, '2025-04-26 00:20:05', '2025-04-26 00:20:05');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `mantenimiento`
--

CREATE TABLE `mantenimiento` (
  `id` int(11) NOT NULL,
  `camion_id` int(11) NOT NULL,
  `fecha` date NOT NULL,
  `descripcion` text NOT NULL,
  `costo` decimal(10,2) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `usuarios`
--

CREATE TABLE `usuarios` (
  `id` int(11) NOT NULL,
  `nombre` varchar(100) NOT NULL,
  `apellido` varchar(100) NOT NULL,
  `cedula` varchar(20) NOT NULL,
  `correo` varchar(100) NOT NULL,
  `contrasena` varchar(100) NOT NULL,
  `rol` enum('administrador','registro','ensayo') NOT NULL,
  `foto` varchar(255) DEFAULT NULL,
  `codigo_verificacion` varchar(10) DEFAULT NULL,
  `verificado` tinyint(1) DEFAULT 0,
  `reset_token` varchar(100) DEFAULT NULL,
  `reset_token_expiry` datetime DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `usuarios`
--

INSERT INTO `usuarios` (`id`, `nombre`, `apellido`, `cedula`, `correo`, `contrasena`, `rol`, `foto`, `codigo_verificacion`, `verificado`, `reset_token`, `reset_token_expiry`, `created_at`) VALUES
(5, 'Dianella', 'Juarez', '28345831', 'juarezmendozamariadianella@gmail.com', '28345831', 'registro', 'static/uploads\\28345831_20250426145035.jpg', '814449', 1, NULL, NULL, '2025-04-26 18:50:35'),
(6, 'Riccardo', 'Fusco', '30090650', 'fuscoriccardo19@gmail.com', '1', 'administrador', '30090650_20250426202807.jpeg', '524919', 1, NULL, NULL, '2025-04-27 00:28:07');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `vendedores`
--

CREATE TABLE `vendedores` (
  `id` int(11) NOT NULL,
  `nombre` varchar(100) NOT NULL,
  `cedula` varchar(20) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `vendedores`
--

INSERT INTO `vendedores` (`id`, `nombre`, `cedula`, `created_at`) VALUES
(1, 'Ana Martínez', 'V-12345678', '2025-04-26 00:20:05'),
(2, 'Luis Sánchez', 'V-23456789', '2025-04-26 00:20:05'),
(3, 'María López', 'V-34567890', '2025-04-26 00:20:05');

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `camiones`
--
ALTER TABLE `camiones`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `placa` (`placa`);

--
-- Indices de la tabla `choferes`
--
ALTER TABLE `choferes`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `cedula` (`cedula`);

--
-- Indices de la tabla `clientes`
--
ALTER TABLE `clientes`
  ADD PRIMARY KEY (`id`),
  ADD KEY `vendedor_id` (`vendedor_id`);

--
-- Indices de la tabla `despachos`
--
ALTER TABLE `despachos`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `guia` (`guia`),
  ADD KEY `cliente_id` (`cliente_id`),
  ADD KEY `chofer_id` (`chofer_id`),
  ADD KEY `vendedor_id` (`vendedor_id`);

--
-- Indices de la tabla `inventario`
--
ALTER TABLE `inventario`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `mantenimiento`
--
ALTER TABLE `mantenimiento`
  ADD PRIMARY KEY (`id`),
  ADD KEY `camion_id` (`camion_id`);

--
-- Indices de la tabla `usuarios`
--
ALTER TABLE `usuarios`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `cedula` (`cedula`),
  ADD UNIQUE KEY `correo` (`correo`);

--
-- Indices de la tabla `vendedores`
--
ALTER TABLE `vendedores`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `cedula` (`cedula`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `camiones`
--
ALTER TABLE `camiones`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT de la tabla `choferes`
--
ALTER TABLE `choferes`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT de la tabla `clientes`
--
ALTER TABLE `clientes`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT de la tabla `despachos`
--
ALTER TABLE `despachos`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT de la tabla `inventario`
--
ALTER TABLE `inventario`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT de la tabla `mantenimiento`
--
ALTER TABLE `mantenimiento`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `usuarios`
--
ALTER TABLE `usuarios`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT de la tabla `vendedores`
--
ALTER TABLE `vendedores`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `clientes`
--
ALTER TABLE `clientes`
  ADD CONSTRAINT `clientes_ibfk_1` FOREIGN KEY (`vendedor_id`) REFERENCES `vendedores` (`id`);

--
-- Filtros para la tabla `despachos`
--
ALTER TABLE `despachos`
  ADD CONSTRAINT `despachos_ibfk_1` FOREIGN KEY (`cliente_id`) REFERENCES `clientes` (`id`),
  ADD CONSTRAINT `despachos_ibfk_2` FOREIGN KEY (`chofer_id`) REFERENCES `choferes` (`id`),
  ADD CONSTRAINT `despachos_ibfk_3` FOREIGN KEY (`vendedor_id`) REFERENCES `vendedores` (`id`);

--
-- Filtros para la tabla `mantenimiento`
--
ALTER TABLE `mantenimiento`
  ADD CONSTRAINT `mantenimiento_ibfk_1` FOREIGN KEY (`camion_id`) REFERENCES `camiones` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
