import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/services/user.service';
import { User } from 'src/app/shared/user.model';

@Component({
  selector: 'app-merry-go-round',
  templateUrl: 'merry-go-round.component.html'
})

export class MerryGoRoundComponent implements OnInit {
  members = [];

  constructor(
    // private chamaService: ChamaService,
    private userService: UserService,
    // private route: ActivatedRoute,
    // private router: Router
  ) {}

  ngOnInit() {
    this.userService.getAllUsers()
      .subscribe( res => {
      this.members = <User[]>res;
    });
  }
}
