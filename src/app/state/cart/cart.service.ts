import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { BASE_API_URL } from "../../config/api";
import { Store } from "@ngrx/store";
import { Router } from "express";
import { ActivatedRoute } from "@angular/router";
import { findProductByCategoryFailure, findProductByCategorySuccess, findProductByIdFailure, findProductByIdSuccess } from "./product.action";
import { catchError, map, of } from "rxjs";
import { error } from "console";
import { addItemToCartFailure, addItemToCartSuccess, getCartFailure, getCartSuccess, removeCartItemFailure, removeCartItemSuccess, removeCartSuccess } from "./cart.action";

@Injectable({
    providedIn:'root',
})
export class CartService{

    API_BASE_URL = BASE_API_URL;

    constructor(
        private store : Store,
        private http : HttpClient,
        private router : Router,
        private route : ActivatedRoute
    ){ }

    addItemToCart(reqData: any) {
        const url = `${this.API_BASE_URL}/cart/add`;
        const headers = new HttpHeaders({
            Authorization: `Bearer ${localStorage.getItem('jwt')}`,
            'Content-Type': 'application/json'
        });

        return this.http
            .put(url, reqData, { headers })
            .pipe(
                map((data: any) => {
                    console.log("added item", data);
                    return addItemToCartSuccess({payload: data});
                }),
                catchError((error: any) => {
                    return of(addItemToCartFailure(
                        error.response && error.response.data 
                        ? error.response.data.message
                        : error.message
                    ))
                })
            ).subscribe((action) => this.store.dispatch(action));
    }

    getCart() {
        const url = `${this.API_BASE_URL}/cart/`;
        const headers = new HttpHeaders({
            Authorization: `Bearer ${localStorage.getItem('jwt')}`,
            'Content-Type': 'application/json'
        });

        return this.http.get(url, { headers }).pipe(
            map((data: any) => {
                console.log("cart : ", data);
                return getCartSuccess({payload: data})
            }),
            catchError((error: any) => {
                return of (getCartFailure(
                    error.response && error.response.data.message
                    ? error.response.data.message
                    : error.message
                ))
            })
        ).subscribe((action) => this.store.dispatch(action));
    }

    removeCartItem(cartItemId: Number){
        const url = `${this.API_BASE_URL}/cart_items/${cartItemId}`;

        const headers = new HttpHeaders({
            Authorization: `Bearer ${localStorage.getItem('jwt')}`,
            'Content-Type': 'application/json'
        });

        return this.http.delete(url, { headers }).pipe(
            map((data:any)=>{
                console.log("removed item : ", data);
                return removeCartItemSuccess({cartItemId})
            }),
            catchError((error: any) => {
               return of(
                removeCartItemFailure(
                    error.response && error.response.data.message
                    ? error.response.data.message
                    : error.message
                )) 
            })
        ).subscribe((action) => this.store.dispatch(action))
    }

    updateCartItem(reqData: any){
        const url = `${this.API_BASE_URL}/cart_items/${reqData.cartItemId}`;

        const headers = new HttpHeaders({
            Authorization: `Bearer ${localStorage.getItem('jwt')}`,
            'Content-Type': 'application/json'
        });

        return this.http.put(url,reqData.data , { headers }).pipe(
            map((data:any)=>{
                console.log("removed item : ", data);
                return removeCartSuccess({cartItemId})
            }),
            catchError((error: any) => {
               return of(
                removeCartItemFailure(
                    error.response && error.response.data.message
                    ? error.response.data.message
                    : error.message
                )) 
            })
        ).subscribe((action) => this.store.dispatch(action))
    }
}