import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UsuarioService, Usuario } from 'src/app/services/usuario/usuario.service';

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
    private camera: Camera // Servicio de camara
  ) {}

  // Al iniciar el componente recupera el usuario del localStorage
  ngOnInit(): void {
    // Recupera usuario del localStorage
    const storedUser = localStorage.getItem('usuarioActual');
    if (storedUser) {
      try {
        const parsed = JSON.parse(storedUser);
        // Valida que tenga los campos nombre, email y contrasena
        if (parsed && parsed.nombre && parsed.email && parsed.contrasena) {
          this.user = parsed;
        } else {
          this.user = null;
        }
      } catch {
        this.user = null;
      }
    }
  }

  togglePassword(): void {
    this.mostrarPassword = !this.mostrarPassword;
  }

  logout(): void {
    localStorage.removeItem('usuarioActual');
    this.router.navigate(['/login']);
  }

  // Metodos camara
  // Toma foto con la camara
  async tomarFoto() {
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
      console.error('Error al seleccionar/tomar foto:', err);
    }
  }

  // Elige foto de la galera
  async elegirFoto() {
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
      console.error('Error al seleccionar/tomar foto:', err);
    }
  }

  // Asigna foto a usuario
  setUserPhoto(imageData: string | undefined) {
    if (!imageData || !this.user) return;
    this.user.foto = 'data:image/jpeg;base64,' + imageData;
    localStorage.setItem('usuarioActual', JSON.stringify(this.user));
    if (this.user.id) {
      this.usuarioService.updateUsuario(this.user);
    }
  }
}