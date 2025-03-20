<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreOrUpdateProductRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'name' => 'required|string|min:4',
            'image' => 'nullable',
            'price_without_tax' => 'required|numeric|min:0',
            'auto_price_enabled' => 'required|boolean',
            'round_price_enabled' => 'required|boolean',
            'tax' => 'required|numeric|min:0',
            'margin' => 'required|numeric|min:0',
            'category_id' => 'required|exists:categories,id',
            'ingredients' => 'nullable|array',
            'ingredients.*.id' => 'required|exists:ingredients,id',
            'ingredients.*.quantity' => 'required|numeric|min:0',
        ];
    }
}
