import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { IonicModule } from '@ionic/angular'; // Import IonicModule
import { NavController } from '@ionic/angular';
import { TmdbService } from '../../services/tmdb.service';

@Component({
  selector: 'app-searchbar',
  templateUrl: './searchbar.component.html',
  styleUrls: ['./searchbar.component.scss'],
})
export class SearchbarComponent implements OnInit {
  @Input() results: any[] = [];
  @Output() close = new EventEmitter<void>();

  /* Pesquisa */
  searchTerm: string = '';
  searchResults: any[] = [];
  showResults: boolean = false; // Controle da visibilidade dos resultados

  constructor(private navCtrl: NavController, private tmdbService: TmdbService) { }

  ngOnInit() { }

  // Método para fechar o searchbar
  onClose() {
    this.close.emit(); // Emite o evento para ocultar o componente
    this.navCtrl.navigateBack('/tabs/tab3'); // Navega de volta para a tab3
  }
  

  /* Utility */
  navigateTo(tab: string) {
    this.navCtrl.navigateRoot(`/tabs/${tab}`);
  }

  navigateToDetailsPage(id: number, mediaType: 'movie' | 'tv') {
    this.navCtrl.navigateForward(`/details/${id}/${mediaType}`);
  }

  closePage() {
    window.location.reload(); // Volta para a página anterior
  }


  

  // Método para realizar a pesquisa
  // Método para realizar a pesquisa
  onSearch() {
    if (this.searchTerm.trim().length > 0) {
      this.tmdbService.searchMoviesAndSeries(this.searchTerm).subscribe(
        (data) => {
          // Ordena os resultados por data de lançamento, se disponível
          this.searchResults = data.results
            .filter((result: any) => result.release_date || result.first_air_date) // Filtra apenas os itens com data
            .sort((a: any, b: any) => {
              const dateA = new Date(a.release_date || a.first_air_date).getTime();
              const dateB = new Date(b.release_date || b.first_air_date).getTime();
              return dateB - dateA; // Ordena do mais recente para o mais antigo
            });
          this.showResults = true; // Exibe os resultados
        },
        (error) => {
          console.error('Erro na busca:', error);
        }
      );
    } else {
      this.searchResults = []; // Limpa os resultados se o campo de busca estiver vazio
      this.showResults = false; // Oculta os resultados
    }
  }


  // Método para obter a URL do banner, se disponível
  getBackdropImage(backdropPath: string): string {
    const defaultBackdrop = 'assets/img/placeholder.jpg'; // Imagem padrão caso não haja banner
    return backdropPath ? 'https://image.tmdb.org/t/p/w500' + backdropPath : defaultBackdrop;
  }

  // Método para voltar e limpar a busca
  navigateBack() {
    this.showResults = false; // Esconde os resultados ao voltar
    this.searchTerm = ''; // Limpa o termo de busca
  }
}
