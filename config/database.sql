SET SQL_MODE="NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";

CREATE TABLE IF NOT EXISTS `photo` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `description` text,
  `owner_id` int(11) NOT NULL COMMENT 'Foreign key linking to the user',
  `set_id` int(11) NOT NULL,
  `date_taken` datetime DEFAULT NULL,
  `location_lat` varchar(50) DEFAULT NULL,
  `location_lon` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `owner_id` (`owner_id`),
  KEY `set_id` (`set_id`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=1 ;

CREATE TABLE IF NOT EXISTS `set` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `start_date` date DEFAULT NULL,
  `end_date` date DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=1 ;

CREATE TABLE IF NOT EXISTS `set_user` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `set_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `set_id` (`set_id`,`user_id`),
  KEY `user_id` (`user_id`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=1 ;

CREATE TABLE IF NOT EXISTS `user` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `email` varchar(255) NOT NULL,
  `password` varchar(100) NOT NULL,
  `name` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=1 ;


ALTER TABLE `photo`
  ADD CONSTRAINT `photo_ibfk_2` FOREIGN KEY (`set_id`) REFERENCES `set` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `photo_ibfk_1` FOREIGN KEY (`owner_id`) REFERENCES `user` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE `set_user`
  ADD CONSTRAINT `set_user_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `set_user_ibfk_1` FOREIGN KEY (`set_id`) REFERENCES `set` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;


INSERT INTO `set` (`id`, `name`, `start_date`, `end_date`) VALUES ('1', 'Testing', '2012-11-01', '2012-11-02');
INSERT INTO `user` (`id`, `email`, `password`, `name`) VALUES ('1', 'default@user.me', SHA1('default'), 'Default User');
INSERT INTO `photo` (`id`, `description`, `owner_id`, `set_id`, `date_taken`, `location_lat`, `location_lon`) VALUES ('1', 'A simple test', '1', '1', '2012-11-06 00:00:00', NULL, NULL);