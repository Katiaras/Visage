import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { MemberListComponent } from './members/member-list/member-list.component';
import { MessagesComponent } from './messages/messages.component';
import { SuggestedListComponent } from './suggested-list/suggested-list.component';
import { AuthGuard } from './guards/auth.guard';
import { ProfileComponent } from './profile/profile.component';
import { MemberDetailComponent } from './members/member-detail/member-detail.component';
import { MemberDetailResolver } from './resolvers/member-detail.resolver';
import { MemberListResolver } from './resolvers/member-list.resolver';
import { MemberEditComponent } from './members/member-edit/member-edit.component';
import { MemberEditResolver } from './resolvers/member-edit.resolver';
import { PreventUnsavedChanges } from './guards/prevent-unsaved-changes.guards';
import { ProfileResolver } from './resolvers/profile.resolver';
import { LikedMemberListComponent } from './members/liked-member-list/liked-member-list.component';
import { LikedMemberListResolver } from './resolvers/liked-member-list.resolver';

export const appRoutes: Routes = [
    { path: '', component: HomeComponent },
    {
        path: '',
        runGuardsAndResolvers: 'always',
        canActivate: [AuthGuard],
        children: [
            { path: 'friends', component: MemberListComponent, resolve: {users: MemberListResolver}},
            { path: 'friends/:id', component: MemberDetailComponent, resolve: {user: MemberDetailResolver}},
            { path: 'user/edit', component: MemberEditComponent,
             resolve: {user: MemberEditResolver}, canDeactivate: [PreventUnsavedChanges]},
            { path: 'messages', component: MessagesComponent},
            { path: 'suggested', component: SuggestedListComponent},
            { path: 'profile', component: ProfileComponent, resolve: {user: ProfileResolver}},
            { path: 'liked', component: LikedMemberListComponent, resolve: {users: LikedMemberListResolver}}
        ]
    },
    { path: '**', redirectTo: '', pathMatch: 'full'},
];
