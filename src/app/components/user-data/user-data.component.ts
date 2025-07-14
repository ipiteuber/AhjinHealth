import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UsuarioService, Usuario } from 'src/app/services/usuario/usuario.service';
import { NavegadorService } from 'src/app/services/navegador/navegador.service';

// Modulos para camara
import { Camera, CameraOptions } from '@awesome-cordova-plugins/camera/ngx';

@Component({
  selector: 'app-user-data',
  templateUrl: './user-data.component.html',
  styleUrls: ['./user-data.component.scss'],
  standalone: false,
})
export class UserDataComponent implements OnInit {
  user: Usuario | null = null;
  mostrarPassword = false;

  constructor(
    private router: Router,
    private usuarioService: UsuarioService,
    private navegador: NavegadorService,
    private camera: Camera // Servicio de camara
  ) {}

  // Al iniciar el componente recupera el usuario del localStorage
  ngOnInit(): void {
    // Recupera usuario del localStorage
    const storedUser = this.usuarioService.getUsuarioLocal();
    if (storedUser) {
      try {
        // Valida que tenga los campos nombre, email y contrasena
        if (storedUser && storedUser.nombre && storedUser.email && storedUser.contrasena) {
          this.user = storedUser;
        } else {
          this.user = null;
          this.usuarioService.removeUsuarioLocal();
          console.warn('Usuario invalido o no encontrado, se elimino del localStorage');
        }
      } catch {
        this.user = null;
        console.error('Error al recuperar el usuario del localStorage');
      }
    } else {
    this.user = null;
    console.warn('No se encontro usuario en el localStorage');}
  }

  // Cambia el estado de mostrarPassword
  togglePassword(): void {
    this.mostrarPassword = !this.mostrarPassword;
  }

  // Cerrar sesion y eliminar usuario del localStorage
  logout(): void {
    this.usuarioService.removeUsuarioLocal();
    this.user = null; // Limpia el usuario actual
    this.router.navigate(['/login']);
    alert('Sesion cerrada correctamente.');
  }

  // Metodos camara
  // Toma foto con la camara
  async tomarFoto() {
    // Previene uso de camara en navegador
    if (this.navegador.isNavegador()) {
      alert('La camara no esta disponible en navegador');
      return;
    }

    const options: CameraOptions = {
      quality: 80,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE,
      sourceType: this.camera.PictureSourceType.CAMERA,
      allowEdit: false,
      targetWidth: 400,
      targetHeight: 400,
      correctOrientation: true,
    };

    try {
      const imageData = await this.camera.getPicture(options);
      this.setUserPhoto(imageData);
    } catch (err) {
      // Si el usuario cancela
      if (err === 'No Image Selected' || err === 'has no access to assets') {
        return;
      }
      alert('Error al seleccionar la foto.');
      console.error('Error al tomar foto:', err);
    }
  }

  // Elige foto de la galera
  async elegirFoto() {
    // Previene uso de camara en navegador
    if (this.navegador.isNavegador()) {
      alert('La camara no esta disponible en navegador');
      return;
    }

    const options: CameraOptions = {
      quality: 80,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE,
      sourceType: this.camera.PictureSourceType.PHOTOLIBRARY,
      allowEdit: false,
      targetWidth: 400,
      targetHeight: 400,
      correctOrientation: true,
    };

    try {
      const imageData = await this.camera.getPicture(options);
      this.setUserPhoto(imageData);
    } catch (err) {
      // Si el usuario cancela
      if (err === 'No Image Selected' || err === 'has no access to assets') {
        return;
      }
      alert('Error al seleccionar la foto.');
      console.error('Error al seleccionar foto:', err);
    }
  }

  // Asigna foto a usuario
  async setUserPhoto(imageData: string | undefined) {
    // Previene uso de camara en navegador
    if (this.navegador.isNavegador()) {
      alert('La camara no esta disponible en navegador');
      return;
    }

    // Verifica que imageData y user no sean nulos
    if (!imageData || !this.user) {
      alert('No se pudo obtener la foto o el usuario no esta definido.');
      return;
    }

    this.user.foto = 'data:image/jpeg;base64,' + imageData;
    this.usuarioService.setUsuarioLocal(this.user);

    // Actualiza el usuario en el servicio
    if (this.user.id) {
      try {
        await this.usuarioService.updateUsuario(this.user);
        alert('Foto actualizada correctamente.');
      } catch (error) {
        console.error('Error al actualizar usuario con foto:', error);
        alert('No se pudo actualizar la foto.');
      }
    }
  }
}
