import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { GService } from './services/g.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'Ribbon UI';

  constructor(
    // ������g�����������Ă����Ȃ���query�p�����[�^���擾�ł��Ȃ��Ȃ�̂ł����œǂ�ł����B
    public g: GService,
  ) {
  }
}
