<?php

namespace App\Http\Requests;

use App\Enums\OrderType;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class CreateOrderRequest extends FormRequest
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
            'customer' => 'required|string|min:3|max:255',
            'type' => ['required', Rule::enum(OrderType::class)],
            'guests' => ['nullable', 'integer', 'min:1', 'required_if:type,dine-in'],
            'phone' => ['nullable', 'string', 'min:10', 'max:20'],
        ];
    }
}
